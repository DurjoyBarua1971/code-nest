"use client";

import React, { useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/app/lib/api";
import { classNames } from "primereact/utils";

interface ProblemFormData {
  id?: string;
  title: string;
  description: string;
  resourceLink: string;
  practiceLink: string;
  difficulty: string;
  createdAt?: string;
}

export default function CreateProblem() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useRef<Toast>(null);
  const isEditMode = searchParams?.get("edit") === "true";
  const problemId = searchParams?.get("id");

  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<ProblemFormData>({
    defaultValues: {
      title: "",
      description: "",
      resourceLink: "",
      practiceLink: "",
      difficulty: "",
    },
    mode: "onChange",
  });

  const difficulties = [
    { name: "Easy", value: "Easy" },
    { name: "Medium", value: "Medium" },
    { name: "Hard", value: "Hard" },
  ];

  // URL validation regex
  const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-./?%&=]*)?$/i;

  useEffect(() => {
    if (isEditMode && problemId) {
      const fetchProblem = async () => {
        try {
          const response = await api.get(`/problems/${problemId}`);
          const problem = response.data;
          Object.keys(problem).forEach((key) => {
            setValue(key as keyof ProblemFormData, problem[key]);
          });
        } catch (error) {
          console.error("Error loading problem for editing:", error);
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "Failed to load problem data",
            life: 3000,
          });
          router.push("/dashboard/problems");
        }
      };
      fetchProblem();
    }
  }, [isEditMode, problemId, router, setValue]);

  const onSubmit = async (data: ProblemFormData) => {
    try {
      const problemData = {
        ...data,
        createdAt: isEditMode ? data.createdAt : new Date().toISOString(),
      };

      if (isEditMode) {
        await api.put(`/problems/${data.id}`, problemData);
      } else {
        await api.post(`/problems`, problemData);
      }

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: isEditMode ? "Problem updated successfully" : "Problem created successfully",
        life: 3000,
      });

      setTimeout(() => {
        router.push("/dashboard/problems");
      }, 1500);
    } catch (error) {
      console.error("Error saving problem:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to save problem. Please try again.",
        life: 3000,
      });
    }
  };

  const viewJSONPreview = () => {
    const jsonPreview = JSON.stringify(getValues(), null, 2);
    toast.current?.show({
      severity: "info",
      summary: "JSON Preview",
      detail: <pre className="whitespace-pre-wrap text-xs">{jsonPreview}</pre>,
      life: 5000,
    });
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Toast ref={toast} position="top-center" />
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center">
          <i
            className={`pi ${isEditMode ? "pi-pencil" : "pi-plus-circle"} mr-3 text-blue-500`}
          ></i>
          {isEditMode ? "Edit Problem" : "Create New Problem"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update the details of the existing problem"
            : "Add a new coding problem to the platform"}
        </p>
      </div>

      <Card className="shadow-xl border border-gray-200 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-field col-span-2">
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Problem Title*
            </label>
            <Controller
              name="title"
              control={control}
              rules={{ required: "Title is required", minLength: { value: 3, message: "Title must be at least 3 characters" } }}
              render={({ field }) => (
                <InputText
                  id="title"
                  {...field}
                  placeholder="Enter a descriptive title"
                  className={classNames("w-full p-3", { "p-invalid": errors.title })}
                />
              )}
            />
            {errors.title && <small className="p-error">{errors.title.message}</small>}
          </div>

          <div className="p-field col-span-2">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Problem Description*
            </label>
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required", minLength: { value: 10, message: "Description must be at least 10 characters" } }}
              render={({ field }) => (
                <InputTextarea
                  id="description"
                  {...field}
                  rows={5}
                  placeholder="Describe the problem in detail"
                  className={classNames("w-full", { "p-invalid": errors.description })}
                />
              )}
            />
            {errors.description && <small className="p-error">{errors.description.message}</small>}
          </div>

          <div className="p-field">
            <label
              htmlFor="resourceLink"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Resource Link*
            </label>
            <Controller
              name="resourceLink"
              control={control}
              rules={{
                required: "Resource link is required",
                pattern: { value: urlPattern, message: "Please enter a valid URL" },
              }}
              render={({ field }) => (
                <InputText
                  id="resourceLink"
                  {...field}
                  placeholder="URL to learning resource"
                  className={classNames("w-full", { "p-invalid": errors.resourceLink })}
                />
              )}
            />
            {errors.resourceLink && <small className="p-error">{errors.resourceLink.message}</small>}
          </div>

          <div className="p-field">
            <label
              htmlFor="practiceLink"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Practice Link
            </label>
            <Controller
              name="practiceLink"
              control={control}
              rules={{
                pattern: { value: urlPattern, message: "Please enter a valid URL" },
              }}
              render={({ field }) => (
                <InputText
                  id="practiceLink"
                  {...field}
                  placeholder="URL to practice this problem"
                  className={classNames("w-full", { "p-invalid": errors.practiceLink })}
                />
              )}
            />
            {errors.practiceLink && <small className="p-error">{errors.practiceLink.message}</small>}
          </div>

          <div className="p-field">
            <label
              htmlFor="difficulty"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Difficulty Level*
            </label>
            <Controller
              name="difficulty"
              control={control}
              rules={{ required: "Difficulty is required" }}
              render={({ field }) => (
                <Dropdown
                  id="difficulty"
                  {...field}
                  options={difficulties}
                  optionLabel="name"
                  placeholder="Select Difficulty"
                  className={classNames("w-full", { "p-invalid": errors.difficulty })}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
            {errors.difficulty && <small className="p-error">{errors.difficulty.message}</small>}
          </div>

          <div className="col-span-2 flex flex-wrap justify-end gap-3 mt-6">
            <Button
              type="button"
              label="Preview JSON"
              icon="pi pi-code"
              className="p-button-secondary p-button-outlined"
              onClick={viewJSONPreview}
            />
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-danger"
              onClick={() => router.push("/dashboard/problems")}
            />
            <Button
              type="submit"
              label={isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Problem" : "Save Problem")}
              icon={isEditMode ? "pi pi-check" : "pi pi-save"}
              loading={isSubmitting}
              disabled={isSubmitting}
              className="p-button-raised shadow-md hover:shadow-lg transition-shadow duration-300"
            />
          </div>
        </form>
      </Card>
    </div>
  );
}