import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { regions } from "util/regions";

import { IOnboardingForm } from "./index.page";

export default function OnboardingStep0({
  loading,
  form,
  onBack,
  onFinish,
  setForm,
}: {
  form: IOnboardingForm;
  loading: boolean;
  onBack: () => void;
  onFinish: () => void;
  setForm: React.Dispatch<React.SetStateAction<IOnboardingForm>>;
}) {
  return (
    <>
      <Form
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        disabled={loading}
      >
        <div>
          <Row gutter={8}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address line 1"
                name={["address", "street1"]}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your address!",
                  },
                ]}
                initialValue={form.address.street1}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        street1: v.target.value,
                      },
                    }));
                  }}
                  placeholder="Please enter your street address"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Address line 2"
                name={["address", "street2"]}
                rules={[
                  {
                    required: false,
                    message: "Please enter your address!",
                  },
                ]}
                initialValue={form.address.street2}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        street2: v.target.value,
                      },
                    }));
                  }}
                  placeholder="Please enter your street address (optional)"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="City"
                name={["address", "city"]}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your city name!",
                  },
                ]}
                initialValue={form.address.city}
              >
                <Input
                  onChange={(v) => {
                    setForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: v.target.value,
                      },
                    }));
                  }}
                  placeholder="Please enter your city name"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Postal Code"
                name={["address", "postalCode"]}
                required
                rules={[
                  {
                    required: true,
                    message: "Please enter your postal code!",
                  },
                  {
                    pattern: /^[0-9]{5}(-[0-9]{4})?$/,
                    message: "Postal code should have 5 digits!",
                  },
                ]}
                initialValue={form.address.postalCode}
              >
                <Input
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        postalCode: e.target.value,
                      },
                    }));
                  }}
                  placeholder="Please enter your postal code"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                extra="We are currently not serving the residents of New York, Hawaii, and South Dakota."
                label="Region"
                name={["address", "region"]}
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your region!",
                  },
                ]}
                initialValue={
                  !form.address.region.length ? undefined : form.address.region
                }
              >
                <Select
                  showSearch
                  placeholder="Select region"
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={regions.map((r) => ({
                    label: r.State,
                    value: r.StateCode,
                    disabled: r.disabled,
                  }))}
                  onSelect={(_, option) => {
                    setForm((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        region: option.value,
                      },
                    }));
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Country"
                extra="We currently serve only in the United States"
                name={["address", "country"]}
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your country!",
                  },
                ]}
                initialValue={form.address.country}
              >
                <Select
                  disabled
                  placeholder="Select country"
                  options={[{ label: "United States", value: "US" }]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button disabled={loading} type="dashed" onClick={onBack}>
                Back
              </Button>
              <Button disabled={loading} type="primary" htmlType="submit">
                Next
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
