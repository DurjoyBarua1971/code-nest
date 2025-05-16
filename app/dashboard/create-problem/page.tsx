"use client";

import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import { useRef } from "react";

interface ProblemFormData {
  title: string;
  description: string;
  resourceLink: string;
  practiceLink: string;
  difficulty: string;
}

export default function CreateProblem() {
  const [formData, setFormData] = useState<ProblemFormData>({
    title: "",
    description: "",
    resourceLink: "",
    practiceLink: "",
    difficulty: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useRef<Toast>(null);

  const difficulties = [
    { name: "Easy", value: "Easy" },
    { name: "Medium", value: "Medium" },
    { name: "Hard", value: "Hard" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDropdownChange = (e: { value: string }) => {
    setFormData({
      ...formData,
      difficulty: e.value,
    });
  };

  const saveProblem = async () => {
    if (!validateForm()) {
      toast.current?.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill all the required fields",
        life: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      // Generate a unique ID for the problem
      const id = Date.now().toString();

      // Create the problem data object with timestamp
      const problemData = {
        id,
        ...formData,
        createdAt: new Date().toISOString(),
      };

      // Get existing problems from localStorage
      const existingProblemsJson = localStorage.getItem("problems");
      const existingProblems = existingProblemsJson
        ? JSON.parse(existingProblemsJson)
        : [];

      // Add new problem to the array
      const updatedProblems = [problemData, ...existingProblems];

      // Save back to localStorage
      localStorage.setItem("problems", JSON.stringify(updatedProblems));

      toast.current?.show({
        severity: "success",
        summary: "Success",
        detail: "Problem created successfully",
        life: 3000,
      });

      // Redirect to problems page after short delay
      setTimeout(() => {
        router.push("/dashboard/problems");
      }, 1500);
    } catch (error) {
      console.error("Error creating problem:", error);
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to create problem. Please try again.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.resourceLink.trim() !== "" &&
      formData.difficulty !== ""
    );
  };

  const viewJSONPreview = () => {
    const jsonPreview = JSON.stringify(formData, null, 2);
    toast.current?.show({
      severity: "info",
      summary: "JSON Preview",
      detail: <pre className="whitespace-pre-wrap text-xs">{jsonPreview}</pre>,
      life: 5000,
    });
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <Toast ref={toast} position="top-center" />
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Create New Problem
        </h1>
        <p className="text-gray-600">
          Add a new coding problem to the platform
        </p>
      </div>

      <Card className="shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-field col-span-2">
            <label
              htmlFor="title"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Problem Title*
            </label>
            <InputText
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter a descriptive title"
              className="w-full p-3"
              required
            />
          </div>

          <div className="p-field col-span-2">
            <label
              htmlFor="description"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Problem Description*
            </label>
            <InputTextarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              placeholder="Describe the problem in detail"
              className="w-full"
              required
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="resourceLink"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Resource Link*
            </label>
            <InputText
              id="resourceLink"
              name="resourceLink"
              value={formData.resourceLink}
              onChange={handleInputChange}
              placeholder="URL to learning resource"
              className="w-full"
              required
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="practiceLink"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Practice Link
            </label>
            <InputText
              id="practiceLink"
              name="practiceLink"
              value={formData.practiceLink}
              onChange={handleInputChange}
              placeholder="URL to practice this problem"
              className="w-full"
            />
          </div>

          <div className="p-field">
            <label
              htmlFor="difficulty"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Difficulty Level*
            </label>
            <Dropdown
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              options={difficulties}
              onChange={handleDropdownChange}
              optionLabel="name"
              placeholder="Select Difficulty"
              className="w-full"
              required
            />
          </div>

          <div className="col-span-2 flex flex-wrap justify-end gap-3 mt-4">
            <Button
              label="Preview JSON"
              icon="pi pi-code"
              className="p-button-secondary"
              onClick={viewJSONPreview}
            />
            <Button
              label="Cancel"
              icon="pi pi-times"
              className="p-button-outlined p-button-danger"
              onClick={() => router.push("/dashboard/problems")}
            />
            <Button
              label={loading ? "Saving..." : "Save Problem"}
              icon="pi pi-save"
              onClick={saveProblem}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
