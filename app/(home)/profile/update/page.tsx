"use client";
import { useUserStore } from "@/lib/mainwebsite/user-store";
import { useState } from "react";
import Link from "next/link";

const INTEREST_ENUM = [
  "TECHNOLOGY",
  "BUSINESS",
  "HEALTHCARE",
  "EDUCATION",
  "ARTS",
  "SCIENCE",
  "ENGINEERING",
  "LAW",
  "FINANCE",
  "MARKETING",
  "DESIGN",
  "MEDIA",
  "SPORTS",
  "CULINARY",
  "LANGUAGES",
  "PSYCHOLOGY",
  "ENVIRONMENT",
  "AGRICULTURE",
  "CONSTRUCTION",
  "HOSPITALITY",
  "RETAIL",
  "TRANSPORTATION",
  "ENTERTAINMENT",
  "NON_PROFIT",
  "GOVERNMENT",
  "OTHER",
];
const INTEREST_LABELS: Record<string, string> = {
  TECHNOLOGY: "Technology",
  BUSINESS: "Business",
  HEALTHCARE: "Healthcare",
  EDUCATION: "Education",
  ARTS: "Arts",
  SCIENCE: "Science",
  ENGINEERING: "Engineering",
  LAW: "Law",
  FINANCE: "Finance",
  MARKETING: "Marketing",
  DESIGN: "Design",
  MEDIA: "Media",
  SPORTS: "Sports",
  CULINARY: "Culinary",
  LANGUAGES: "Languages",
  PSYCHOLOGY: "Psychology",
  ENVIRONMENT: "Environment",
  AGRICULTURE: "Agriculture",
  CONSTRUCTION: "Construction",
  HOSPITALITY: "Hospitality",
  RETAIL: "Retail",
  TRANSPORTATION: "Transportation",
  ENTERTAINMENT: "Entertainment",
  NON_PROFIT: "Non Profit",
  GOVERNMENT: "Government",
  OTHER: "Other",
};

export default function UserUpdateProfilePage() {
  const { profile, isLoading, updateUserProfile } = useUserStore();
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    bio: profile?.bio || "",
    interests: profile?.interests || [],
    tags: profile?.tags?.join(", ") || "",
    address: {
      pincode: profile?.address?.pincode || "",
      address: profile?.address?.address || "",
      country: profile?.address?.country || "",
    },
  });
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      setForm({ ...form, address: { ...form.address, [key]: value } });
    } else if (name === "interests" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      let newInterests = [...form.interests];
      if (checked) {
        newInterests.push(value);
      } else {
        newInterests = newInterests.filter((i) => i !== value);
      }
      setForm({ ...form, interests: newInterests });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Build only changed fields
    const updatedFields: any = {};
    if (form.name !== (profile?.name || "")) updatedFields.name = form.name;
    if (form.bio !== (profile?.bio || "")) updatedFields.bio = form.bio;
    if (JSON.stringify(form.interests) !== JSON.stringify(profile?.interests || [])) {
      updatedFields.interests = form.interests;
    }
    if (form.tags !== (profile?.tags?.join(", ") || "")) {
      updatedFields.tags = form.tags.split(",").map(s => s.trim()).filter(Boolean);
    }
    // Address: check if any field changed
    const origAddr = profile?.address || {};
    const addrChanged = ["pincode", "address", "country"].some(
      key => form.address[key as "pincode" | "address" | "country"] !== (origAddr[key as "pincode" | "address" | "country"] || "")
    );
    if (addrChanged) {
      updatedFields.location = {
        pincode: form.address.pincode,
        address: form.address.address,
        country: form.address.country,
      };
    }
    await updateUserProfile(updatedFields);
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-16">
      <Link href="/profile" className="inline-block mb-4 text-green-700 hover:underline font-medium">← Back to Profile</Link>
      <h1 className="text-3xl font-bold text-green-700 mb-8">Update Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <div>
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="input-style w-full"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="input-style w-full"
            required
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={3}
            className="input-style w-full"
            placeholder="Tell us about yourself"
          />
          {/* To display bio with newlines, use style={{ whiteSpace: 'pre-line' }} in the profile page */}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Interests</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INTEREST_ENUM.map((interest) => (
              <label key={interest} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="interests"
                  value={interest}
                  checked={form.interests.includes(interest)}
                  onChange={handleChange}
                />
                <span>{INTEREST_LABELS[interest]}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="input-style w-full"
            placeholder="Comma separated (e.g. student, beginner)"
          />
        </div>
        {/* Address fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="address.pincode"
              value={form.address.pincode}
              onChange={handleChange}
              className="input-style w-full"
              placeholder="Pincode"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <input
              type="text"
              name="address.country"
              value={form.address.country}
              onChange={handleChange}
              className="input-style w-full"
              placeholder="Country"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address.address"
              value={form.address.address}
              onChange={handleChange}
              className="input-style w-full"
              placeholder="Address"
            />
          </div>
        </div>
        <button className="btn-green w-full mt-4" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        {success && <div className="text-green-600 text-center mt-2">Profile updated!</div>}
      </form>
    </div>
  );
}
