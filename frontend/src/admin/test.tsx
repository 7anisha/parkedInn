/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import API from "../api/api";

const Test = () => {
  const [floorPlan, setFloorPlan] = React.useState<string>('');

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const slot = (event.currentTarget.slot as any).value;
    const floorPlan = event.currentTarget.floor_plan.files[0];
    const space = new FormData();
    space.append('floor_plan', floorPlan);
    space.append('slot', slot);
    console.log(space);
    API.patch(`/test/update-space`, space, { headers: { 'Content-Type': 'multipart/form-data' }, responseType: 'blob' }).then((response) => {
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const imageObjectURL = URL.createObjectURL(blob);
      setFloorPlan(imageObjectURL);
    }).catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className='p-4'>
      <form onSubmit={handleSave}>
        <label className="label">
          <span className="label-text">Your parking slot</span>
        </label>
        <input
          type="text"
          name="slot"
          placeholder="Enter your parking slot"
          className="input input-bordered w-full mb-4"
        />
        <label className="label">
          <span className="label-text">File</span>
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs"
          id="file"
          name='floor_plan'
          accept=".xml"
        />
        <div className="mt-8">
          <button className='btn btn-primary' type="submit">Save</button>
        </div>
      </form>
      {floorPlan && <img src={floorPlan} alt="floor plan" />}
    </div>
  );
};

export default Test;
