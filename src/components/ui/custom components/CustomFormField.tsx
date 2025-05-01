import React from "react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Upload,
  Camera,
  X,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormFieldComponentProps } from "../../../types/form";
import { PopoverClose } from "@radix-ui/react-popover";
import { Textarea } from "../textarea";

const CustomFormField: React.FC<FormFieldComponentProps> = ({
  field,
  form,
  fieldConfig,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [lastX, setLastX] = React.useState(0);
  const [lastY, setLastY] = React.useState(0);

  const initializeCanvas = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Get the container's dimensions
      const rect = canvas.getBoundingClientRect();

      // Set the canvas size to match its CSS size
      canvas.width = rect.width;
      canvas.height = rect.height;

      if (context) {
        context.lineWidth = 2;
        context.lineCap = "round";
        context.strokeStyle = "#000";
      }
    }
  };

  React.useEffect(() => {
    if (isModalOpen) {
      // Initialize after the dialog is fully open
      if (fieldConfig.type === "signature") {
        setTimeout(initializeCanvas, 100);
      }
    }
  }, [isModalOpen, fieldConfig.type]);

  switch (fieldConfig.type) {
    case "text":
    case "email":
    case "number":
      if (fieldConfig.multiple) {
        return (
          <FormField
            control={form.control}
            name={field}
            render={({ field: fieldProps }) => {
              const values = Array.isArray(fieldProps.value)
                ? fieldProps.value
                : [fieldProps.value || ""];

              const addField = () => {
                if (
                  fieldConfig.maxFields &&
                  values.length >= fieldConfig.maxFields
                ) {
                  return;
                }
                fieldProps.onChange([...values, ""]);
              };

              const removeField = (index: number) => {
                const newValues = values.filter((_, i) => i !== index);
                fieldProps.onChange(newValues.length > 0 ? newValues : [""]);
              };

              const updateField = (index: number, value: string) => {
                const newValues = [...values];
                newValues[index] = value;
                fieldProps.onChange(newValues);
              };

              return (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    {fieldConfig.label}
                  </FormLabel>
                  <div className="space-y-2">
                    {values.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <FormControl>
                          <Input
                            type={fieldConfig.type}
                            placeholder={fieldConfig.placeholder}
                            className="bg-slate-700 border-slate-600 text-slate-100"
                            value={value}
                            onChange={(e) => updateField(index, e.target.value)}
                          />
                        </FormControl>
                        {values.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="bg-slate-700 hover:bg-slate-600"
                            onClick={() => removeField(index)}
                          >
                            <X className="text-slate-200 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {(!fieldConfig.maxFields ||
                      values.length < fieldConfig.maxFields) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 text-slate-200"
                        onClick={addField}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {fieldConfig.addButtonLabel ||
                          `Adauga ${fieldConfig.label.toLowerCase()}`}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      }
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <FormControl>
                <Input
                  type={fieldConfig.type}
                  placeholder={fieldConfig.placeholder}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "textarea":
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={fieldConfig.placeholder}
                  className="bg-slate-700 border-slate-600 text-slate-100"
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "date":
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
                        !fieldProps.value && "text-slate-400"
                      )}
                    >
                      {fieldProps.value ? (
                        format(fieldProps.value, "PPP")
                      ) : (
                        <span>Alege o data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-slate-800"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={fieldProps.value}
                    onSelect={fieldProps.onChange}
                    initialFocus
                    className="bg-slate-800 text-slate-100"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "toggle":
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={fieldProps.value}
                  onValueChange={fieldProps.onChange}
                  className="justify-start bg-slate-700 rounded-lg p-1"
                >
                  {fieldConfig.options.map((option) => (
                    <ToggleGroupItem
                      key={option.value}
                      value={option.value}
                      className="data-[state=on]:bg-slate-900 data-[state=on]:text-white text-slate-200"
                    >
                      {option.label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "combobox":
      if (fieldConfig.multiple) {
        return (
          <FormField
            control={form.control}
            name={field}
            render={({ field: fieldProps }) => {
              const values = Array.isArray(fieldProps.value)
                ? fieldProps.value
                : [fieldProps.value || ""];

              const addField = () => {
                if (
                  fieldConfig.maxFields &&
                  values.length >= fieldConfig.maxFields
                ) {
                  return;
                }
                fieldProps.onChange([...values, ""]);
              };

              const removeField = (index: number) => {
                const newValues = values.filter((_, i) => i !== index);
                fieldProps.onChange(newValues.length > 0 ? newValues : [""]);
              };

              const updateField = (index: number, value: string) => {
                const newValues = [...values];
                newValues[index] = value;
                fieldProps.onChange(newValues);
              };

              return (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    {fieldConfig.label}
                  </FormLabel>
                  <div className="space-y-2">
                    {values.map((value, index) => (
                      <div key={index} className="flex gap-2">
                        <FormControl className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
                                    !value && "text-slate-400"
                                  )}
                                >
                                  {value
                                    ? fieldConfig.options.find(
                                        (option) => option.value === value
                                      )?.label
                                    : fieldConfig.placeholder}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-800"
                              align="start"
                              sideOffset={4}
                            >
                              <Command className="bg-slate-800">
                                <CommandInput
                                  placeholder={`Cauta ${fieldConfig.label.toLowerCase()}...`}
                                  className="h-9 bg-slate-800 text-slate-100"
                                />
                                <CommandEmpty className="py-2 text-slate-400">
                                  Nu s-a gasit niciun rezultat.
                                </CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-auto">
                                  <CommandList>
                                    {fieldConfig.options.map((option) => (
                                      <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                          updateField(index, option.value);
                                        }}
                                        className="text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                                      >
                                        <PopoverClose className="w-full h-full flex">
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              value === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {option.label}
                                        </PopoverClose>
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        {values.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200"
                            onClick={() => removeField(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {(!fieldConfig.maxFields ||
                      values.length < fieldConfig.maxFields) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 text-slate-200"
                        onClick={addField}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {fieldConfig.addButtonLabel ||
                          `Adauga ${fieldConfig.label.toLowerCase()}`}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      }
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
                        !fieldProps.value && "text-slate-400"
                      )}
                    >
                      {fieldProps.value
                        ? fieldConfig.options.find(
                            (option) => option.value === fieldProps.value
                          )?.label
                        : fieldConfig.placeholder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-800"
                  align="start"
                  sideOffset={4}
                >
                  <Command className="bg-slate-800">
                    <CommandInput
                      placeholder={`Cauta ${fieldConfig.label.toLowerCase()}...`}
                      className="h-9 bg-slate-800 text-slate-100"
                    />
                    <CommandEmpty className="py-2 text-slate-400">
                      Nu s-a gasit niciun rezultat.
                    </CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-auto">
                      <CommandList>
                        {fieldConfig.options.map((option) => (
                          <CommandItem
                            key={option.value}
                            value={option.label}
                            onSelect={() => {
                              fieldProps.onChange(option.value);
                            }}
                            className="text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                          >
                            <PopoverClose className="w-full h-full flex">
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  fieldProps.value === option.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {option.label}
                            </PopoverClose>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "quantityCombobox":
      if (fieldConfig.multiple) {
        return (
          <FormField
            control={form.control}
            name={field}
            render={({ field: fieldProps }) => {
              const values = Array.isArray(fieldProps.value)
                ? fieldProps.value
                : [fieldProps.value || { value: "", quantity: 1 }];
              const addField = () => {
                if (
                  fieldConfig.maxFields &&
                  values.length >= fieldConfig.maxFields
                ) {
                  return;
                }
                fieldProps.onChange([...values, { value: "", quantity: 1 }]);
              };

              const removeField = (index: number) => {
                const newValues = values.filter((_, i) => i !== index);
                fieldProps.onChange(
                  newValues.length > 0
                    ? newValues
                    : [{ value: "", quantity: 1 }]
                );
              };

              const updateField = (
                index: number,
                item: { value: string; quantity?: number }
              ) => {
                const newValues = [...values];
                newValues[index] = item;
                fieldProps.onChange(newValues);
              };

              return (
                <FormItem>
                  <FormLabel className="text-slate-200">
                    {fieldConfig.label}
                  </FormLabel>
                  <div className="space-y-2">
                    {values.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <FormControl className="flex-1">
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-full justify-between bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
                                    !item.value && "text-slate-400"
                                  )}
                                >
                                  {item.value
                                    ? fieldConfig.options.find(
                                        (option) => option.value === item.value
                                      )?.label
                                    : fieldConfig.placeholder}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-800"
                              align="start"
                              sideOffset={4}
                            >
                              <Command className="bg-slate-800">
                                <CommandInput
                                  placeholder={`Cauta ${fieldConfig.label.toLowerCase()}...`}
                                  className="h-9 bg-slate-800 text-slate-100"
                                />
                                <CommandEmpty className="py-2 text-slate-400">
                                  Nu s-a gasit niciun rezultat.
                                </CommandEmpty>
                                <CommandGroup className="max-h-60 overflow-auto">
                                  <CommandList>
                                    {fieldConfig.options.map((option) => (
                                      <CommandItem
                                        key={option.value}
                                        value={option.label}
                                        onSelect={() => {
                                          updateField(index, {
                                            value: option.value,
                                            quantity: item.quantity || 1,
                                          });
                                        }}
                                        className="text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                                      >
                                        <PopoverClose className="w-full h-full flex">
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              item.value === option.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {option.label}
                                        </PopoverClose>
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>

                        <Input
                          type="number"
                          className="w-24 bg-slate-700 border-slate-600 text-slate-100"
                          value={item.quantity}
                          onChange={(e) => {
                            const quantity = e.target.value
                              ? parseInt(e.target.value)
                              : undefined;
                            updateField(index, {
                              value: item.value,
                              quantity: quantity,
                            });
                          }}
                        />

                        {values.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="bg-slate-700 hover:bg-slate-600 text-slate-200"
                            onClick={() => removeField(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {(!fieldConfig.maxFields ||
                      values.length < fieldConfig.maxFields) && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-slate-700 text-slate-200"
                        onClick={addField}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        {fieldConfig.addButtonLabel ||
                          `Adauga ${fieldConfig.label.toLowerCase()}`}
                      </Button>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        );
      }
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => {
            const value = fieldProps.value || { value: "", quantity: 1 };

            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-slate-200">
                  {fieldConfig.label}
                </FormLabel>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="flex-1">
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600",
                            !value.value && "text-slate-400"
                          )}
                        >
                          {value.value
                            ? fieldConfig.options.find(
                                (option) => option.value === value.value
                              )?.label
                            : fieldConfig.placeholder}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[var(--radix-popover-trigger-width)] p-0 bg-slate-800"
                      align="start"
                      sideOffset={4}
                    >
                      <Command className="bg-slate-800">
                        <CommandInput
                          placeholder={`Cauta ${fieldConfig.label.toLowerCase()}...`}
                          className="h-9 bg-slate-800 text-slate-100"
                        />
                        <CommandEmpty className="py-2 text-slate-400">
                          Nu s-a gasit niciun rezultat.
                        </CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          <CommandList>
                            {fieldConfig.options.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.label}
                                onSelect={() => {
                                  fieldProps.onChange({
                                    value: option.value,
                                    quantity: value.quantity || 1,
                                  });
                                }}
                                className="text-slate-100 hover:bg-slate-700 hover:text-slate-100"
                              >
                                <PopoverClose className="w-full h-full flex">
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value.value === option.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {option.label}
                                </PopoverClose>
                              </CommandItem>
                            ))}
                          </CommandList>
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <Input
                    type="number"
                    className="w-24 bg-slate-700 border-slate-600 text-slate-100"
                    value={value.quantity}
                    onChange={(e) => {
                      const quantity = e.target.value
                        ? parseInt(e.target.value)
                        : undefined;
                      fieldProps.onChange({
                        value: value.value,
                        quantity: quantity,
                      });
                    }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );
    case "image":
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => (
            <FormItem>
              <FormLabel className="text-slate-200">
                {fieldConfig.label}
              </FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Preview Area */}
                  {fieldProps.value && fieldProps.value.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {fieldProps.value.map(
                        (imageUrl: string, index: number) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded-lg overflow-hidden bg-slate-700"
                          >
                            <img
                              src={imageUrl}
                              alt={`Upload ${index + 1}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              onClick={() => {
                                const newValue = fieldProps.value.filter(
                                  (_: string, i: number) => i !== index
                                );
                                fieldProps.onChange(newValue);
                              }}
                              className="absolute top-2 right-2 p-1 bg-slate-900/80 rounded-full hover:bg-slate-900"
                            >
                              <X className="h-4 w-4 text-slate-100" />
                            </button>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* Upload Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* File Upload */}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        multiple={fieldConfig.maxFiles !== 1}
                        className="hidden"
                        id={`${field}-upload`}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          const maxFiles = fieldConfig.maxFiles || Infinity;

                          if (files.length > maxFiles) {
                            alert(
                              `You can only upload up to ${maxFiles} files`
                            );
                            return;
                          }

                          // Convert files to URLs
                          const fileUrls = files.map((file) =>
                            URL.createObjectURL(file)
                          );
                          const currentUrls = fieldProps.value || [];
                          fieldProps.onChange([...currentUrls, ...fileUrls]);
                        }}
                      />
                      <label
                        htmlFor={`${field}-upload`}
                        className="flex items-center justify-center px-4 py-2 bg-slate-700 text-slate-100 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Incarca Poze
                      </label>
                    </div>

                    {/* Camera Capture (shown only on devices with camera support) */}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        id={`${field}-camera`}
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            const fileUrl = URL.createObjectURL(files[0]);
                            const currentUrls = fieldProps.value || [];
                            fieldProps.onChange([...currentUrls, fileUrl]);
                          }
                        }}
                      />
                      <label
                        htmlFor={`${field}-camera`}
                        className="flex items-center justify-center px-4 py-2 bg-slate-700 text-slate-100 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Fa o Poza
                      </label>
                    </div>
                  </div>

                  {/* Help text */}
                  <p className="text-sm text-slate-400">
                    {fieldConfig.maxFiles
                      ? `Poti incarca pana la ${fieldConfig.maxFiles} poze`
                      : "Poti incarca mai multe poze"}
                  </p>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    case "signature":
      return (
        <FormField
          control={form.control}
          name={field}
          render={({ field: fieldProps }) => {
            const getCoordinates = (
              event: React.TouchEvent | React.MouseEvent
            ) => {
              if (!canvasRef.current) return null;
              const canvas = canvasRef.current;
              const rect = canvas.getBoundingClientRect();

              let clientX, clientY;
              if ("touches" in event) {
                clientX = event.touches[0].clientX;
                clientY = event.touches[0].clientY;
              } else {
                clientX = (event as React.MouseEvent).clientX;
                clientY = (event as React.MouseEvent).clientY;
              }

              return {
                x: clientX - rect.left,
                y: clientY - rect.top,
              };
            };

            const startDrawing = (e: React.TouchEvent | React.MouseEvent) => {
              const coordinates = getCoordinates(e);
              if (coordinates) {
                setIsDrawing(true);
                setLastX(coordinates.x);
                setLastY(coordinates.y);
              }
            };

            const draw = (e: React.TouchEvent | React.MouseEvent) => {
              if (!isDrawing || !canvasRef.current) return;
              e.preventDefault();

              const coordinates = getCoordinates(e);
              if (coordinates && canvasRef.current) {
                const context = canvasRef.current.getContext("2d");
                if (context) {
                  context.beginPath();
                  context.moveTo(lastX, lastY);
                  context.lineTo(coordinates.x, coordinates.y);
                  context.stroke();
                  setLastX(coordinates.x);
                  setLastY(coordinates.y);
                }
              }
            };

            const stopDrawing = () => {
              setIsDrawing(false);
            };

            const clearSignature = () => {
              if (canvasRef.current) {
                const context = canvasRef.current.getContext("2d");
                if (context) {
                  context.clearRect(
                    0,
                    0,
                    canvasRef.current.width,
                    canvasRef.current.height
                  );
                }
                fieldProps.onChange(null);
              }
            };

            const saveSignature = () => {
              if (canvasRef.current) {
                const signatureData = canvasRef.current.toDataURL();
                fieldProps.onChange(signatureData);
                setIsModalOpen(false);
              }
            };
            return (
              <FormItem>
                <FormLabel className="text-slate-200">
                  {fieldConfig.label}
                </FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {fieldProps.value && (
                      <div className="mb-2 p-4 border border-slate-600 rounded-lg bg-slate-800">
                        <img
                          src={fieldProps.value}
                          alt="Signature"
                          className="max-h-20 mx-auto"
                        />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-slate-700 text-slate-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      {fieldProps.value
                        ? "Modifica Semnatura"
                        : "Adauga Semnatura"}
                    </Button>

                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogContent className="sm:max-w-[600px] bg-slate-800 text-slate-200">
                        <DialogHeader>
                          <DialogTitle>Semnatura</DialogTitle>
                          <DialogDescription>
                            Deseneaza semnatura folosind degetul sau mouse-ul
                          </DialogDescription>
                        </DialogHeader>
                        <div className="relative border border-slate-600 rounded-lg bg-slate-800 p-4">
                          <canvas
                            ref={canvasRef}
                            className="w-full h-40 touch-none bg-slate-100 rounded-md"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                          />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={clearSignature}
                            className="bg-slate-700 text-slate-200"
                          >
                            Sterge
                          </Button>
                          <Button
                            type="button"
                            onClick={saveSignature}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                          >
                            Salveaza
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      );

    default:
      return null;
  }
};

export default CustomFormField;
