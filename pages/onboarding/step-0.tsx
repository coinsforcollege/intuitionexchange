import { Button, Col, Form, Input, Row, Select } from "antd";

import { IOnboardingForm } from "./index.page";

export default function OnboardingStep0({
  loading,
  form,
  onFinish,
  setForm,
}: {
  form: IOnboardingForm;
  loading: boolean;
  onFinish: () => void;
  setForm: React.Dispatch<React.SetStateAction<IOnboardingForm>>;
}) {
  const [cForm] = Form.useForm();

  return (
    <>
      <Form
        form={cForm}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        disabled={loading}
      >
        <div>
          <Row gutter={8}>
            <Col xs={24} md={12}>
              <Form.Item
                label="First Name"
                name="firstName"
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your first name!",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message:
                      "Special characters (including numbers) not allowed",
                  },
                ]}
                initialValue={form.firstName}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      firstName: v.target.value,
                    }));
                  }}
                  placeholder="Please enter your first name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Middle Name"
                name="middleName"
                rules={[
                  {
                    required: false,
                    message: "Please enter your middle name!",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message:
                      "Special characters (including numbers) not allowed",
                  },
                ]}
                initialValue={form.middleName}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      middleName: v.target.value,
                    }));
                  }}
                  placeholder="Please enter your middle name (optional)"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Last Name"
                name="lastName"
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your last name!",
                  },
                  {
                    pattern: /^[a-zA-Z]+$/,
                    message:
                      "Special characters (including numbers) not allowed",
                  },
                ]}
                initialValue={form.lastName}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      lastName: v.target.value,
                    }));
                  }}
                  placeholder="Please enter your last name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item required label="Date of birth">
                <Input.Group compact>
                  <Form.Item
                    name="birthDateYYYY"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Birth year is required",
                      },
                      {
                        type: "number",
                        min: 1950,
                        max: 2050,
                        transform: (value) => Number(value),
                        message: "The month should be between 1950 to 2050",
                      },
                    ]}
                    initialValue={form.birthday.year}
                  >
                    <Input
                      style={{ width: "40%" }}
                      placeholder="YYYY"
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          birthday: {
                            ...prev.birthday,
                            year: e.target.value?.toString() ?? "",
                          },
                        }));
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="birthDateMM"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Birth month is required",
                      },
                      {
                        max: 2,
                        message: "The month should be in MM format",
                      },
                      {
                        type: "number",
                        min: 1,
                        max: 12,
                        transform: (value) => Number(value),
                        message: "The month should be between 1 to 12",
                      },
                    ]}
                    initialValue={form.birthday.month}
                  >
                    <Input
                      style={{ width: "30%" }}
                      placeholder="MM"
                      onBlur={(e) => {
                        cForm.setFieldValue(
                          "birthDateMM",
                          e.target.value.padStart(2, "0")
                        );
                      }}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          birthday: {
                            ...prev.birthday,
                            month: e.target.value?.toString() ?? "",
                          },
                        }));
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    name="birthDateDD"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Birth day is required",
                      },
                      {
                        max: 2,
                        message: "The day should be in DD format",
                      },
                      {
                        type: "number",
                        min: 1,
                        max: 31,
                        transform: (value) => Number(value),
                        message: "The day should be between 1 to 31",
                      },
                    ]}
                    initialValue={form.birthday.day}
                  >
                    <Input
                      style={{ width: "30%" }}
                      placeholder="DD"
                      onBlur={(e) => {
                        cForm.setFieldValue(
                          "birthDateDD",
                          e.target.value.padStart(2, "0")
                        );
                      }}
                      onChange={(e) => {
                        setForm((prev) => ({
                          ...prev,
                          birthday: {
                            ...prev.birthday,
                            day: e.target.value?.toString() ?? "",
                          },
                        }));
                      }}
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col xs={24} md={4}>
              <Form.Item
                label="Gender"
                name="gender"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your gender!",
                  },
                ]}
                initialValue={form.sex}
              >
                <Select
                  placeholder="Select gender"
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                  onSelect={(value) => {
                    setForm((prev) => ({
                      ...prev,
                      sex: value,
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="SSN / Tax ID"
                name="taxId"
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your Social Security Number!",
                  },
                  {
                    pattern:
                      /^(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/,
                    message: "Incorrect Social Security Number format!",
                  },
                ]}
                initialValue={form.taxId}
              >
                <Input
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      taxId: e.target.value,
                    }));
                  }}
                  placeholder="Please enter your Social Security Number"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tax Country"
                name="taxCountry"
                extra="We currently serve only in the United States"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your tax country!",
                  },
                ]}
                initialValue={form.taxCountry}
              >
                <Select
                  disabled
                  placeholder="Select tax country"
                  options={[{ label: "United States", value: "US" }]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button disabled={loading} type="primary" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
