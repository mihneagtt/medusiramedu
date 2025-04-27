import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CustomFormField from "./CustomFormField";
import { ReusableFormProps } from "@/types/form";
import { zodResolver } from "@hookform/resolvers/zod";

const ReusableForm: React.FC<ReusableFormProps> = ({
  title,
  schema,
  fields,
  onSubmit,
  submitLabel = "Submit",
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(
      Object.entries(fields).map(([key, config]) => [key, config.defaultValue])
    ),
  });

  const handleSubmit = () => {
    onSubmit(form.getValues());
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800">
        <CardHeader>
          <CardTitle className="text-xl text-slate-100">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {Object.entries(fields).map(([fieldName, fieldConfig]) => (
                <CustomFormField
                  key={fieldName}
                  field={fieldName}
                  form={form}
                  fieldConfig={fieldConfig}
                />
              ))}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitLabel}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReusableForm;
