import { Link } from "react-router-dom"
import Lottie from 'react-lottie';
import QRAnimation from '../assets/qr-animation.json'
import ParkingAnimation from '../assets/parking-animation.json'
import LogoAnimation from '../assets/logo-animation.json'

export default function Component() {
    return (
        <main>
            <div className="hero bg-base-100 min-h-[50vh]">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <img
                        src="/hero.png"
                        className="max-w-xl rounded-lg ml-8 max-md:max-w-sm max-sm:max-w-xs max-md:ml-0"
                    />
                    <div>
                        <h1 className="text-5xl font-bold">Find your perfect parking spot in seconds</h1>
                        <p className="py-6">
                            Never waste time driving around looking for parking again. With ParkedInn, easily find, reserve, and pay for parking — all from the convenience of your phone or computer.
                        </p>
                        <Link to="/parkings" className="btn btn-primary w-full text-white">Find parking now</Link>
                    </div>
                </div>
            </div>
            <section className="w-full bg-base-200">
                <div className="pt-8 pb-14">
                    <div className="text-2xl font-semibold text-center">How It Works</div>
                    <div className="text-lg text-center mt-2">Simplifying parking in 3 easy steps</div>
                </div>
                <div className="flex justify-center items-center pb-12 md:pb-24 lg:pb-32 space-x-16 max-md:flex-col max-md:space-x-0 max-md:space-y-8">
                    <div className="w-1/5 max-md:w-4/5 flex flex-col items-center justify-center space-y-4 text-center">
                        <span className="iconify mingcute--search-3-line text-5xl text-primary" />
                        <h3 className="text-xl font-semibold">Search Your Location</h3>
                        <p className="text-muted-foreground">Wherever you’re headed — we’ve got parking nearby. Just enter your destination, and we’ll show you available parking spots. <br /><br /></p>
                    </div>
                    <div className="w-1/5 max-md:w-4/5 flex flex-col items-center justify-center space-y-4 text-center">
                        <span className="iconify mingcute--check-2-fill text-5xl text-primary" />
                        <h3 className="text-xl font-semibold">Reserve in Seconds</h3>
                        <p className="text-muted-foreground">Choose the spot that works best for you. Whether it’s for the hour, day, or month — our simple interface makes booking a breeze. Reserve your space instantly, and skip the stress!</p>
                    </div>
                    <div className="w-1/5 max-md:w-4/5 flex flex-col items-center justify-center space-y-4 text-center">
                        <span className="iconify mingcute--car-3-line text-5xl text-primary" />
                        <h3 className="text-xl font-semibold">Park and Go</h3>
                        <p className="text-muted-foreground">Arrive at your destination knowing your parking is sorted. Our digital confirmations, easy access instructions, and QR code scanning mean you’re good to go in seconds.</p>
                    </div>
                </div>
            </section>
            <section>
                <div className="my-4 flex justify-around max-md:flex-col">
                    <div className="mockup-phone scale-75">
                        <div className="camera"></div>
                        <div className="display">
                            <div className="artboard artboard-demo phone-1 flex flex-col items-center justify-center space-y-4 bg-blue-300">
                                <Lottie
                                    options={{
                                        loop: true,
                                        animationData: LogoAnimation,
                                        rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                                    }}
                                    height={200}
                                    width={200}
                                />
                                <div className="text-xl font-semibold">ParkedInn</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center w-1/2 max-md:w-full max-md:mb-8">
                        <div className="p-4">
                            <div className="text-2xl font-semibold mb-2 max-md:mb-0">Book you parking slot</div>
                            <div className="max-w-lg">
                                Booking a parking slot has never been easier! With ParkedInn, simply enter your destination, choose from a list of available spots, and reserve your parking in seconds. Whether you need a space for an hour, a day, or even a month, our user-friendly platform lets you book the perfect spot without the hassle. Skip the search and secure your parking slot ahead of time, so you’re all set upon arrival.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-4 flex justify-around max-md:flex-col-reverse">
                    <div className="flex flex-col justify-center items-center w-1/2 max-md:w-full">
                        <div className="p-4">
                            <div className="text-2xl font-semibold mb-2">Show the QR Code</div>
                            <div className="max-w-lg">
                                Once you’ve booked your parking spot, accessing it is a breeze. ParkedInn provides a digital confirmation with a unique QR code for your reservation. Just show the QR code on your phone when you arrive, and you’re all set to park. No need for paper receipts or fumbling with payment details—one quick scan, and you’re ready to go!
                            </div>
                        </div>
                    </div>
                    <Lottie
                        options={{
                            loop: true,
                            animationData: QRAnimation,
                            rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                        }}
                        height={400}
                        width={400}
                    />
                </div>
                <div className="my-4 flex justify-around max-md:flex-col">
                    <Lottie
                        options={{
                            loop: true,
                            animationData: ParkingAnimation,
                            rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                        }}
                        height={400}
                        width={400}
                    />
                    <div className="flex flex-col justify-center items-center w-1/2 max-md:w-full">
                        <div className="p-4">
                            <div className="text-2xl font-semibold mb-2">Park your car</div>
                            <div className="max-w-lg">
                                Arrive with peace of mind, knowing your parking spot is reserved just for you. Follow the easy access instructions, park your car, and you’re all set. With ParkedInn’s seamless booking and entry process, you can focus on enjoying your destination instead of worrying about where to park.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-base-200">
                <div className="py-8">
                    <div className="text-2xl font-semibold text-center">Why choose us?</div>
                </div>
                <div className="flex flex-col justify-center items-center pb-6 max-md:flex-col max-md:space-x-0 max-md:space-y-8">
                    <div className="flex items-start justify-center space-x-4 w-1/2 my-8 max-md:w-full">
                        <span className="iconify mingcute--check-circle-line text-4xl text-success" />
                        <div className="w-3/4">
                            <h3 className="text-xl font-semibold">Save Time, Save Money</h3>
                            <p className="text-muted-foreground">Stop circling blocks in search of parking. With our platform, you'll find guaranteed spots at affordable rates, saving you both time and money.</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-center space-x-4 w-1/2 my-8 max-md:w-full">
                        <span className="iconify mingcute--check-circle-line text-4xl text-success" />
                        <div className="w-3/4">
                            <h3 className="text-xl font-semibold">Find Parking Everywhere</h3>
                            <p className="text-muted-foreground">No matter where you're headed, we’ve got you covered. From city center parking to hidden gems in local neighborhoods, find a spot in seconds.</p>
                        </div>
                    </div>
                    <div className="flex items-start justify-center space-x-4 w-1/2 my-8 max-md:w-full">
                        <span className="iconify mingcute--check-circle-line text-4xl text-success" />
                        <div className="w-3/4">
                            <h3 className="text-xl font-semibold">Book with Confidence</h3>
                            <p className="text-muted-foreground">Trust in our easy-to-use platform and secure payment system. Whether it’s street parking or a garage, rest assured that your spot is waiting for you.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-base-100">
                <div className="py-8">
                    <div className="text-2xl font-semibold text-center">FAQ</div>
                </div>
                <div className="px-8 py-4 space-y-4">
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" defaultChecked />
                        <div className="collapse-title text-lg font-medium">How Do I Know the Parking Space is Available?</div>
                        <div className="collapse-content">
                            <p>Once you book your space, it’s yours! We show you real-time availability, so you can reserve with confidence.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-lg font-medium">What Happens if I Arrive Late?</div>
                        <div className="collapse-content">
                            <p>No problem! Your reservation is held until the specified time, so there’s no stress if you’re running behind.                        </p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-lg font-medium">Can I Change or Cancel My Booking?</div>
                        <div className="collapse-content">
                            <p>Yes, you can modify or cancel your reservation up to 24 hours in advance for a full refund. Check our cancellation policy for full details.</p>
                        </div>
                    </div>
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="radio" name="my-accordion-2" />
                        <div className="collapse-title text-lg font-medium">Is My Payment Secure?</div>
                        <div className="collapse-content">
                            <p>Absolutely! We use the latest encryption technology to ensure your payment and personal details are safe and secure.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="w-full bg-base-200">
                <div className="py-8 flex items-center justify-center">
                    <div className="max-w-2xl text-center px-4">
                        <div className="text-2xl font-semibold text-center mb-2">About Us</div>
                        <div className="text-xl text-center mb-8">Revolutionizing Parking</div>
                        <p>At ParkedInn, we believe that parking should be hassle-free. No more driving in circles or rushing to find a space. We connect you with a network of parking spaces that are just a few clicks away. With a wide range of parking options at affordable prices, our goal is simple: to make parking as easy as it should be.</p>
                        <p>Whether you're heading to work, a concert, a meeting, or just running errands, we provide a smarter way to park. Our platform helps drivers like you take control of their parking needs — in just a few taps.</p>
                    </div>
                </div>
            </section>
            <section className="flex max-md:flex-col max-md:px-8 max-md:space-y-8 py-8">
                <div className="w-1/2 max-md:w-full">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-full max-w-lg">
                            <h2 className="text-3xl font-bold">Contact Us - We’re Here to Help!</h2>
                            <p className="mt-4 text-muted-foreground md:text-xl">
                                Have questions or need support? Our friendly team is ready to assist you!
                            </p>
                            <form className="space-y-4 mt-8">
                                <div className="grid gap-2">
                                    <label htmlFor="name">Name</label>
                                    <input id="name" placeholder="Enter your name" className="input input-bordered w-full" />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" placeholder="Enter your email" className="input input-bordered w-full" />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" className="textarea textarea-bordered" placeholder="Message"></textarea>
                                </div>
                                <button type="submit" className="w-full btn btn-primary">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 max-md:w-full">
                    <h2 className="text-3xl font-bold">Or meet us at our office</h2>
                    <p className="mt-4 text-muted-foreground md:text-xl">
                        Coffee is on us! Drop by our office to chat with our team.
                    </p>
                    <div className="mt-4">
                        <strong>Address:</strong> To - New Delhi, India
                        <br />
                        <strong>Phone:</strong> 9199652510
                        <br />
                        <strong>Email:</strong> support@parkedinn.com
                    </div>
                    <img
                        src="/map.png"
                        alt="Address"
                        className="mt-4 w-3/4 h-96 aspect-square overflow-hidden rounded-xl object-cover max-md:w-full"
                    />
                </div>
            </section>
        </main>
    )
}