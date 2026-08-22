import Button from "../common/Button";

export default function Newsletter() {

    return (

        <section className="py-20 bg-gray-100">

            <div className="max-w-xl mx-auto text-center">

                <h2 className="text-4xl font-bold">

                    Subscribe Newsletter

                </h2>

                <input
                    className="border w-full mt-8 p-3 rounded-lg"
                    placeholder="Enter Email"
                />

                <div className="mt-5">

                    <Button title="Subscribe" />

                </div>

            </div>

        </section>

    )

}