/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from "react";
import API from "../api/api";
import set from "../utils/set";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import FloorPlanVizualizer from "../utils/floor-plan-vizualizer";

const ViewRenderer = (value: any, type: string) => {
    if (type === "image") {
        return <img src={value} className="w-80 object-contain rounded" alt="avatar" />
    } else if (type === "date") {
        return dayjs(value).format("DD MMM YYYY, h:mm A");
    } else if (type === "boolean") {
        return value ? "Yes" : "No"
    } else if (type === "array") {
        return [value].flat().join(", ");
    } else if (type === "link") {
        return <a href={`parkings/${value}/spaces`} className="btn">View spaces</a>
    } else if (type === "floor-plan") {
        return <FloorPlanVizualizer plan={value} />
    } else {
        return value;
    }
}

const InputRenderer = (field: any, value: any, errors: any, setErrors: any) => {
    if (field.type === "enum") {
        return <select
            name={field.field}
            defaultValue={value}
            className={`select select-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        >
            {field.options.map((option: any) => <option key={option} value={option}>{option[0] + option.slice(1)?.toLowerCase()?.replace('_', ' ')}</option>)}
        </select>
    } else if (field.type === "image") {
        return <input
            type="text"
            name={field.field}
            defaultValue={value}
            placeholder={field.placeholder || field.title}
            className={`input input-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    } else if (field.type === "number") {
        return <input
            type="number"
            step="any"
            name={field.field}
            defaultValue={value}
            placeholder={field.placeholder || field.title}
            className={`input input-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    } else if (field.type === "boolean") {
        return <input
            type="checkbox"
            name={field.field}
            defaultChecked={value}
            className={`checkbox ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    } else if (field.type === "array") {
        return <input
            type="text"
            name={field.field}
            defaultValue={value}
            placeholder={field.placeholder || field.title}
            className={`input input-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    } else if (field.type === "link") {
        return <a href={`parkings/${value}/spaces`} className="btn">Edit spaces</a>
    } else if (field.type === "floor-plan") {
        return <input
            type="file"
            name={field.field}
            className={`file-input file-input-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    } else {
        return <input
            type={field.type}
            name={field.field}
            defaultValue={value}
            placeholder={field.placeholder || field.title}
            className={`input input-bordered w-full ${errors[field.field] ? "input-error" : ""}`}
            onChange={() => setErrors((errors: any) => ({ ...errors, [field.field]: "" }))}
        />
    }
}

const Page = ({ config }: any) => {
    const { id } = useParams();
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const [modalType, setModalType] = useState<'ADD' | 'VIEW' | 'EDIT' | 'DELETE'>('ADD');
    const [search, setSearch] = useState<string>('');
    const [pagination, setPagination] = useState<any>({ page: 1, limit: 20, total: 0 });
    const modalRef = useRef<HTMLDialogElement>(null);
    const [modalValues, setModalValues] = useState<any>({});
    const [errors, setErrors] = useState<any>({});

    const key = config.key?.replace(":id", id);

    const fetchData = useCallback(() => {
        setLoading(true);
        API.get(`/admin/${key}?page=${pagination.page}&limit=${pagination.limit}&search=${search}`).then((response) => {
            setData(response.data?.data || []);
            setPagination(response.data?.pagination || {});
            setLoading(false);
        });
    }, [key, pagination.page, pagination.limit, search]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 500);

        return () => clearTimeout(timer);
    }, [fetchData]);

    const openModal = (type: 'ADD' | 'VIEW' | 'EDIT' | 'DELETE') => (item: any) => {
        setModalType(type);
        setModalValues(JSON.parse(JSON.stringify(item)));
        modalRef.current?.showModal();
    }

    const closeModal = () => {
        modalRef.current?.close();
    }

    const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const body: any = {};

        for (const [key, value] of formData.entries()) {
            set(body, key, value);
        }

        const headers = { 'Content-Type': 'multipart/form-data' };

        try {
            if (modalType === 'ADD') {
                await API.post(`/admin/${key}`, formData, { headers });
            } else if (modalType === 'EDIT') {
                await API.patch(`/admin/${key}/${modalValues.id}`, formData, { headers });
            } else if (modalType === 'DELETE') {
                await API.delete(`/admin/${key}/${modalValues.id}`);
            }
            closeModal();
            fetchData();
        } catch (error: any) {
            setErrors(error.response.data.errors || {});
        }
    }

    return <div className="p-6">
        <h2 className="text-xl font-semibold">{config.title}</h2>
        <div className="flex max-md:flex-col justify-between items-center max-md:items-stretch max-md:space-y-4 mt-4">
            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                className="input input-bordered w-96"
                placeholder={`Search ${config.title.toLowerCase()}`}
            />
            {config.acl.add && <button className="btn btn-outline btn-primary" onClick={() => openModal('ADD')({})}>
                <span className="iconify mingcute--add-line text-xl" />
                <span className="ml-1">Add {config.singularTitle}</span>
            </button>}
        </div>
        <div className="overflow-x-auto mt-4">
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        {config.fields.filter(((item: any) => item.table)).map((field: any) => <th key={field.field}>{field.title}</th>)}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item: any, index: number) => (
                        <tr key={item.id}>
                            <th>{pagination.limit * (pagination.page - 1) + index + 1}</th>
                            {config.fields.filter(((item: any) => item.table)).map((field: any) => <td key={field.field}>{ViewRenderer(item[field.field], field.type)}</td>)}
                            <td>
                                <button className="btn btn-sm btn-ghost" onClick={() => openModal('VIEW')(item)}>
                                    <span className="iconify mingcute--eye-2-line text-lg" />
                                </button>
                                {config.acl.edit && <button className="btn btn-sm btn-ghost" onClick={() => openModal('EDIT')(item)}>
                                    <span className="iconify mingcute--pencil-line text-lg" />
                                </button>}
                                {config.acl.delete && <button className="btn btn-sm btn-ghost" onClick={() => openModal('DELETE')(item)}>
                                    <span className="iconify mingcute--delete-2-line text-lg" />
                                </button>}
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (loading ? <tr>
                        <td colSpan={config.fields.filter(((item: any) => item.table)).length + 2} className="relative h-14">
                            <span className="loading loading-dots loading-lg absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
                        </td>
                    </tr> : <tr>
                        <td colSpan={config.fields.filter(((item: any) => item.table)).length + 2} className="text-center text-lg text-slate-600">No records to show</td>
                    </tr>)}
                </tbody>
            </table>
            <div className="flex justify-end space-x-4 items-center mt-8">
                <div>Items per page:</div>
                <select className="select select-bordered" onChange={(e) => setPagination({ ...pagination, limit: parseInt(e.target.value) })} value={pagination.limit}>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                </select>
                <div className="join">
                    {new Array(Math.ceil(pagination.total / pagination.limit)).fill(0).map((_, index) => (
                        <button key={index} className={`join-item btn ${pagination.page === index + 1 ? "btn-active" : ""}`} onClick={() => setPagination({ ...pagination, page: index + 1 })}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
        <dialog ref={modalRef} className="modal">
            <div className="modal-box max-w-none w-1/2 max-md:w-[90%]" key={modalType + modalValues.id}>
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-4 top-5" onClick={closeModal}>✕</button>
                </form>
                <div className="flex w-full flex-col border-opacity-50">
                    <h3 className="font-bold text-lg capitalize">{modalType.toLowerCase()} {config.singularTitle}</h3>
                    <div className="divider"></div>
                </div>
                <form onSubmit={handleSave} className="flex flex-col space-y-4">
                    {config.fields.map((field: any) => ((["ADD", "EDIT"].includes(modalType) ? field.modify : modalType === "VIEW") ? <div key={modalType + field.field}>
                        <label className="label">
                            <span className={`label-text ${errors[field.field] ? "text-red-600" : ""}`}>{field.title} {errors[field.field]}</span>
                        </label>
                        {modalType === "VIEW" ? <div className="text-lg ml-1 font-semibold">
                            {ViewRenderer(modalValues[field.field], field.type)}
                        </div> : <div>
                            {InputRenderer(field, modalValues[field.field], errors, setErrors)}
                        </div>}
                    </div> : null))}
                    {modalType === "DELETE" && <div>Are you sure you want to delete this {config.singularTitle.toLowerCase()}?</div>}
                    {modalType === "VIEW" || <div className="flex justify-end space-x-4 pt-4">
                        <button type="submit" className={modalType === "DELETE" ? "btn btn-error" : "btn btn-primary"}>{modalType === "DELETE" ? "Confirm" : "Save"}</button>
                        <button type="button" className="btn btn-outline btn-primary" onClick={closeModal}>Cancel</button>
                    </div>}
                </form>
            </div>
        </dialog>
    </div>
}

export default Page;