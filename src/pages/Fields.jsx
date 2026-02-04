
import { useState } from "react";
import { Search, User } from "lucide-react";

import { InputField } from "../components/fields/InputField";
import { SelectField } from "../components/fields/SelectField";
import { MultiSelectField } from "../components/fields/MultiSelectField";
import { TextareaField } from "../components/fields/TextareaField";
import { CheckboxField, RadioField } from "../components/fields/CheckboxField";
import { MultiSelectDropdownField } from "../components/fields/MultiSelectDropdownField";

export default function Fields() {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [skills, setSkills] = useState([]);
  const [description, setDescription] = useState("");
  const [agree, setAgree] = useState(false);
  const [gender, setGender] = useState("male");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
const [roles, setRoles] = useState([]);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Fields Demo</h1>

      {/* Basic Input */}
      <InputField
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="This is your legal name"
      />

      {/* Input with Left Icon */}
      <InputField
        label="Username"
        placeholder="Enter username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        icon={User}
        iconPosition="left"
      />

      {/* Input with Right Icon */}
      <InputField
        label="Search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        icon={Search}
        iconPosition="right"
      />

      {/* Date */}
      <InputField
        label="Date of Birth"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Time */}
      <InputField
        label="Meeting Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* Select */}
      <SelectField
        label="Country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        options={[
          { label: "India", value: "in" },
          { label: "USA", value: "us" },
          { label: "Germany", value: "de" },
        ]}
      />

      {/* Multi Select */}
      <MultiSelectField
        label="Skills"
        selectedValues={skills}
        onChange={setSkills}
        helperText="Press Enter to add"
      />

      <MultiSelectDropdownField
  label="Roles"
  name="roles"
  options={[
    { id: "1", label: "Admin" },
    { id: "2", label: "Editor" },
    { id: "3", label: "Viewer" },
  ]}
  value={roles}
  onChange={setRoles}
/>

      {/* Textarea */}
      <TextareaField
        label="Description"
        value={description}
        onChange={setDescription}
      />

      {/* Checkbox */}
      <CheckboxField
        label="I agree to Terms"
        checked={agree}
        onChange={(e) => setAgree(e.target.checked)}
      />

      {/* Radio */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Gender</p>
        <RadioField
          label="Male"
          name="gender"
          checked={gender === "male"}
          onChange={() => setGender("male")}
        />
        <RadioField
          label="Female"
          name="gender"
          checked={gender === "female"}
          onChange={() => setGender("female")}
        />
      </div>
    </div>
  );
}
