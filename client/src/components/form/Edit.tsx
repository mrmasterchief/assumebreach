import { Formik, Field, Form, FormikHelpers } from "formik";


interface FormValues {
    address: {
        city: string;
        state: string;
        country: string;
        zip: string;
    };
    phone: string;
    birthdate: string;
    email: string;
    full_name: string;
    password: {
        old: string;
        new: string;
    }
  }
  

interface Props {
  formType: "address" | "phone" | "birthdate" | "email" | "full_name" | "password";
  onSubmit: (
    values: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => void;
  formVisible: boolean;
}

const inputStyles = "border-2 border-gray-500 rounded-md p-2 w-[100%] h-[40px]";
const inputStyle2 = "border-2 border-gray-500 rounded-md p-2 w-[50%] h-[40px] bg-gray-200 cursor-not-allowed";

const EditTemplate = ({ formType, onSubmit, formVisible}: Props) => {
    return(
        <Formik
            initialValues={{
                address: {
                    city: "",
                    state: "",
                    country: "",
                    zip: "",
                },
                phone: "",
                birthdate: "",
                email: "",
                full_name: "",
                password: {
                    old: "",
                    new: ""
                }
            }}
            onSubmit={onSubmit}
        >
            {({ values }) => (
                <Form
                className={`flex flex-col overflow-hidden transition-[max-height] duration-300 ease-in-out gap-2 ${
                    formVisible ? "max-h-[500px]" : "max-h-0"
                }`}
            >
                    {formType === "address" && (
                        <>
                        <div className="flex flex-row gap-4">
                            <Field
                                name="address.city"
                                type="text"
                                placeholder="City"
                                className={inputStyles}
                                required
                            />
                            <Field
                                name="address.state"
                                type="text"
                                placeholder="State"
                                className={inputStyles}
                                required
                            />
                            </div>
                            <div className="flex flex-row gap-4">
                            <Field
                                name="address.country"
                                type="text"
                                placeholder="Country"
                                className={inputStyles}
                                required
                            />
                            <Field
                                name="address.zip"
                                type="text"
                                placeholder="Zip Code"
                                className={inputStyles}
                                required
                            />
                            </div>
                            </>
                        
                    )}
                    {formType === "phone" && (
                        <Field
                            name="phone"
                            type="text"
                            placeholder="Phone Number"
                            className={inputStyles}
                            required
                        />
                    )}
                    {formType === "birthdate" && (
                        <Field
                            name="birthdate"
                            type="date"
                            placeholder="Birthdate"
                            className={inputStyles}
                            required
                        />
                    )}
                    {formType === "email" && (
                        <Field
                            name="email"
                            type="email"
                            placeholder="Email"
                            className={inputStyles}
                            required
                        />
                    )}
                    {formType === "full_name" && (
                        <Field
                            name="full_name"
                            type="text"
                            placeholder="Full Name"
                            className={inputStyles}
                            required
                        />
                    )}
                    {formType === "password" && (
                        <div className="flex flex-row gap-4">
                            <Field
                                name="password.old"
                                type="password"
                                placeholder="Old Password"
                                className={inputStyles}
                                required
                            />
                            <Field
                                name="password.new"
                                type="password"
                                placeholder="New Password"
                                className={inputStyles}
                                required
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-black text-white rounded-md p-2 hover:bg-gray-800 ransition duration-200 w-[25%] self-end"
                    >
                        Save Changes
                    </button>
                </Form>
            )}
        </Formik>
    )
}

export default EditTemplate;
