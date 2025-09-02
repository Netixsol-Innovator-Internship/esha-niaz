"use client";
import { useState } from "react";
import { useCreateCarMutation } from "../src/redux/api";
import { toast } from "./Toaster";
import { useRouter } from "next/navigation";

export default function SellCarForm({ onDone }) {
  const router = useRouter();
  const [form, setForm] = useState({
    vin: "",
    year: "",
    make: "",
    model: "",
    maxBid: "",
    mileage: "",
    engineSize: "",
    paint: "",
    hasGccSpecs: false,
    features: "",
    accidentHistory: false,
    fullServiceHistory: false,
    modified: "stock",
    description: "",
    startTime: "",
    endTime: "",
    sellerType: "dealer",
    sellerFirstName: "",
    sellerLastName: "",
    sellerEmail: "",
    sellerPhone: "",
  });
  const [photos, setPhotos] = useState([]);
  const [createCar, { isLoading }] = useCreateCarMutation();

  const set = (k, v) => setForm(s => ({ ...s, [k]: v }));

function onFilesChange(e) {
  const newFiles = Array.from(e.target.files || []);

  // merge old + new
  const merged = [...photos, ...newFiles];

  if (merged.length > 5) {
    toast("You can upload up to 5 photos");
    return;
  }

  // validate types
  const bad = newFiles.find(f => !/^image\/(jpe?g|png|webp|gif)$/i.test(f.type));
  if (bad) {
    toast("Only image files (jpg, png, webp, gif) are allowed");
    return;
  }

  setPhotos(merged);
}


  async function handleSubmit(e) {
    e.preventDefault();
    // basic required validation
    if (!form.vin || !form.year || !form.make || !form.model || !form.maxBid) {
      toast("Please fill required fields: VIN, Year, Make, Model, Max Bid");
      return;
    }
    if (photos.length > 5) {
      toast("You can upload up to 5 photos");
      return;
    }

    const fd = new FormData();
    // Append text fields (all fields must be strings)
    fd.append("vin", form.vin);
    fd.append("year", String(form.year));
    fd.append("make", form.make);
    fd.append("model", form.model);
    fd.append("maxBid", String(form.maxBid));
    if (form.mileage) fd.append("mileage", String(form.mileage));
    if (form.engineSize) fd.append("engineSize", form.engineSize);
    if (form.paint) fd.append("paint", form.paint);
    fd.append("hasGccSpecs", form.hasGccSpecs ? "true" : "false");
    if (form.features) fd.append("features", form.features);
    fd.append("accidentHistory", form.accidentHistory ? "true" : "false");
    fd.append("fullServiceHistory", form.fullServiceHistory ? "true" : "false");
    if (form.modified) fd.append("modified", form.modified);
    if (form.description) fd.append("description", form.description);
    if (form.startTime) fd.append("startTime", form.startTime);
    if (form.endTime) fd.append("endTime", form.endTime);

    // seller info
    if (form.sellerType) fd.append("sellerType", form.sellerType);
    if (form.sellerFirstName) fd.append("sellerFirstName", form.sellerFirstName);
    if (form.sellerLastName) fd.append("sellerLastName", form.sellerLastName);
    if (form.sellerEmail) fd.append("sellerEmail", form.sellerEmail);
    if (form.sellerPhone) fd.append("sellerPhone", form.sellerPhone);

    // photos: append each file under the same field name "photos"
    photos.forEach((file) => fd.append("photos", file, file.name));

    try {
      const res = await createCar(fd).unwrap();
      toast("Car listed for sale");
      // optional: reset
      setForm({
        vin: "", year: "", make: "", model: "", maxBid: "",
        mileage: "", engineSize: "", paint: "", hasGccSpecs: false,
        features: "", accidentHistory: false, fullServiceHistory: false,
        modified: "stock", description: "", startTime: "", endTime: "",
        sellerType: "dealer", sellerFirstName: "", sellerLastName: "",
        sellerEmail: "", sellerPhone: ""
      });
      setPhotos([]);
      if (typeof onDone === "function") onDone(res); // ✅ call back to ProfilePage
      // you can navigate to profile or show created car id:
      router.push("/profile?tab=mycars");
    } catch (err) {
      console.error(err);
      toast(err?.data?.message || err?.message || "Failed to create car");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 card p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">VIN *</label>
          <input className="input" value={form.vin} onChange={e=>set("vin", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Year *</label>
          <input type="number" className="input" value={form.year} onChange={e=>set("year", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Make *</label>
          <input className="input" value={form.make} onChange={e=>set("make", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Model *</label>
          <input className="input" value={form.model} onChange={e=>set("model", e.target.value)} required />
        </div>

        <div>
          <label className="text-sm">Max Bid (required)</label>
          <input type="number" className="input" value={form.maxBid} onChange={e=>set("maxBid", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm">Mileage</label>
          <input type="number" className="input" value={form.mileage} onChange={e=>set("mileage", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Engine Size</label>
          <input className="input" value={form.engineSize} onChange={e=>set("engineSize", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Paint</label>
          <input className="input" value={form.paint} onChange={e=>set("paint", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm">Features</label>
        <input className="input" value={form.features} onChange={e=>set("features", e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Start Time</label>
          <input className="input" type="datetime-local" value={form.startTime} onChange={e=>set("startTime", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">End Time</label>
          <input className="input" type="datetime-local" value={form.endTime} onChange={e=>set("endTime", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="text-sm">Description</label>
        <textarea className="input" value={form.description} onChange={e=>set("description", e.target.value)} />
      </div>

      <div>
        <label className="text-sm">Photos (max 5)</label>
        
  {/* File input */}
  <input
    className="mt-1"
    type="file"
    accept="image/*"
    multiple
    onChange={onFilesChange}
  />
    {/* Preview selected files */}
  <div className="mt-2 flex flex-wrap gap-3">
    {photos.map((file, idx) => (
      <div key={idx} className="relative w-24 h-24 border rounded overflow-hidden">
        <img
          src={URL.createObjectURL(file)}
          alt={`photo-${idx}`}
          className="w-full h-full object-cover"
        />
        {/* Delete button */}
        <button
          type="button"
          className="absolute top-0 right-0 bg-red-600 text-white px-1 rounded-bl"
          onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
        >
          ✕
        </button>
      </div>
    ))}
  </div>

        <div className="text-xs text-gray-500 mt-1">{photos.length} file(s) selected</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Seller First Name</label>
          <input className="input" value={form.sellerFirstName} onChange={e=>set("sellerFirstName", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Seller Last Name</label>
          <input className="input" value={form.sellerLastName} onChange={e=>set("sellerLastName", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Seller Email</label>
          <input className="input" type="email" value={form.sellerEmail} onChange={e=>set("sellerEmail", e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Seller Phone</label>
          <input className="input" value={form.sellerPhone} onChange={e=>set("sellerPhone", e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2">
        <button disabled={isLoading} className="btn btn-primary">
          {isLoading ? "Listing..." : "List Car for Sale"}
        </button>
        <button type="button" onClick={() => { setPhotos([]); if (typeof onDone === "function") onDone(); }} className="btn">
          Cancel
        </button>
      </div>
    </form>
  );
}
