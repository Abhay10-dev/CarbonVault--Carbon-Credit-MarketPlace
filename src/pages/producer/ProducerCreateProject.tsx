import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  FileCheck,
  ShieldCheck,
  MapPin,
  Save,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { MockMap } from '@/components/ui/MockMap';
import type { ProjectType, Project } from '@/types';

export function ProducerCreateProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProject, addNotification } = useApp();

  const [step, setStep] = useState(1);

  // Form states
  const [name, setName] = useState('Sahyadri Biodiversity & Reforestation Project');
  const [type, setType] = useState<ProjectType>('Reforestation');
  const [description, setDescription] = useState(
    'Restoring native broadleaf forests along degraded riparian corridors in Satara district to enhance carbon sinks, reduce soil erosion, and safeguard local water tables.'
  );
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2031-09-30');
  const [projectArea, setProjectArea] = useState(15.4);
  const [totalArea, setTotalArea] = useState(18.0);
  const [expectedCredits, setExpectedCredits] = useState(3850);
  const [methodology, setMethodology] = useState('Afforestation / Reforestation');

  // Land Info
  const [surveyNumber, setSurveyNumber] = useState('214/1');
  const [village, setVillage] = useState('Wai');
  const [taluka, setTaluka] = useState('Wai');
  const [district, setDistrict] = useState('Satara');
  const [state, setState] = useState('Maharashtra');
  const [latitude, setLatitude] = useState(17.9463);
  const [longitude, setLongitude] = useState(73.8941);

  // Uploaded documents simulation
  const [docs, setDocs] = useState([
    { name: '7/12 Digital Extract (Digitally Signed)', uploaded: true },
    { name: '8A Khate Extract', uploaded: true },
    { name: 'Land Ownership Deed / Mutation Record', uploaded: true },
    { name: 'Detailed Project Proposal & Feasibility Report', uploaded: true },
    { name: 'Baseline Carbon Sequestration Calculation Sheet', uploaded: true },
    { name: 'Pre-intervention High-res Satellite Imagery', uploaded: true },
  ]);

  const toggleDoc = (index: number) => {
    setDocs(prev =>
      prev.map((d, i) => (i === index ? { ...d, uploaded: !d.uploaded } : d))
    );
  };

  const readinessPercent = Math.round(
    ((name && type && description && expectedCredits ? 25 : 0) +
      (surveyNumber && village && district && latitude && longitude ? 25 : 0) +
      (docs.filter(d => d.uploaded).length / docs.length) * 50)
  );

  const handleSubmit = (asDraft: boolean = false) => {
    const newId = `PRJ-00${Math.floor(25 + Math.random() * 50)}`;
    const newProject: Project = {
      id: newId,
      name,
      type,
      description,
      producerId: user?.id || 'u001',
      producerName: user?.name || 'Rajesh Patil',
      status: asDraft ? 'draft' : 'submitted',
      startDate,
      endDate,
      location: `${district}, ${state}`,
      methodology,
      expectedCredits,
      landInfo: {
        surveyNumber,
        village,
        taluka,
        district,
        state,
        totalArea,
        projectArea,
        latitude,
        longitude,
      },
      documents: docs.map((d, i) => ({
        id: `doc-${i + 1}`,
        category: 'Land & Project',
        name: d.name,
        status: d.uploaded ? 'uploaded' : 'requires_update',
        uploadedAt: new Date().toISOString().split('T')[0],
      })),
      evidence: [
        {
          id: 'ev-1',
          type: 'Satellite Evidence',
          description: 'Baseline GPS boundary & polygon map',
          status: 'uploaded',
          uploadedAt: new Date().toISOString().split('T')[0],
        },
      ],
      createdAt: new Date().toISOString(),
      submittedAt: asDraft ? undefined : new Date().toISOString(),
      verification: {
        certifierId: 'u003',
        certifierName: 'Green Certification Agency',
        startedAt: new Date().toISOString(),
        checklist: [
          { stage: 'project_info', label: 'Project Information', status: 'done' },
          { stage: 'producer_info', label: 'Producer Information', status: 'done' },
          { stage: 'land_ownership', label: 'Land Ownership', status: 'pending' },
          { stage: 'land_record', label: '7/12 Land Record', status: 'pending' },
          { stage: 'project_boundary', label: 'Project Boundary', status: 'pending' },
          { stage: 'coordinates', label: 'Coordinates', status: 'pending' },
          { stage: 'satellite_evidence', label: 'Satellite Evidence', status: 'pending' },
          { stage: 'project_evidence', label: 'Project Evidence', status: 'pending' },
          { stage: 'carbon_calculation', label: 'Carbon Calculation', status: 'pending' },
          { stage: 'field_verification', label: 'Supporting Documents', status: 'pending' },
        ],
        auditTrail: [
          {
            timestamp: new Date().toISOString(),
            actor: user?.name || 'Producer',
            role: 'Producer',
            action: asDraft ? 'Saved draft' : 'Submitted project for verification',
          },
        ],
      },
    };

    addProject(newProject);

    if (!asDraft) {
      addNotification({
        id: `notif-${Date.now()}`,
        userId: user?.id || 'u001',
        title: 'Project Submitted',
        message: `${name} has been submitted for certification review.`,
        read: false,
        type: 'success',
        date: new Date().toISOString(),
      });
    }

    navigate('/producer/projects');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Wizard Step Navigation */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Create Carbon Offset Project</h1>
            <p className="text-xs text-gray-500">
              Submit your project documentation for independent validation and carbon credit tokenization.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-forest-50 text-forest-700 rounded-md">
            Step {step} of 4
          </span>
        </div>

        {/* Stepper bar */}
        <div className="grid grid-cols-4 gap-2 text-xs font-medium">
          {[
            { num: 1, label: '1. Project Info' },
            { num: 2, label: '2. Land & Location' },
            { num: 3, label: '3. Evidence & Docs' },
            { num: 4, label: '4. Review & Submit' },
          ].map(s => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-2 rounded-xl text-center border transition-all ${
                step === s.num
                  ? 'border-forest-600 bg-forest-50/70 text-forest-900 font-semibold'
                  : step > s.num
                  ? 'border-gray-200 bg-gray-50 text-gray-700'
                  : 'border-transparent text-gray-400'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs animate-fade-in">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Project Overview & Carbon Accounting
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Project Name *</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Project Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as ProjectType)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
                >
                  <option value="Reforestation">Reforestation</option>
                  <option value="Afforestation">Afforestation</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                  <option value="Waste Management">Waste Management</option>
                  <option value="Agricultural Practices">Agricultural Practices</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Approved Methodology *</label>
                <input
                  type="text"
                  value={methodology}
                  onChange={e => setMethodology(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Project Description *</label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-forest-600/20 focus:border-forest-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Expected CO₂ Removal (tCO₂e) *</label>
                <input
                  type="number"
                  value={expectedCredits}
                  onChange={e => setExpectedCredits(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-xs text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Continue to Location <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Land & Location */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs animate-fade-in">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Land Records & Geographic Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Survey / Gat No. *</label>
                  <input
                    type="text"
                    value={surveyNumber}
                    onChange={e => setSurveyNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Taluka</label>
                  <input
                    type="text"
                    value={taluka}
                    onChange={e => setTaluka(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">District / State</label>
                  <input
                    type="text"
                    value={`${district}, ${state}`}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Total Parcel Area (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={totalArea}
                    onChange={e => setTotalArea(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Project Dedicated Area (ha)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={projectArea}
                    onChange={e => setProjectArea(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={e => setLatitude(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={e => setLongitude(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Satellite Boundary Mock Map */}
            <div>
              <span className="text-xs font-semibold text-gray-700 block mb-1">
                Geospatial Boundary Preview
              </span>
              <MockMap
                latitude={latitude}
                longitude={longitude}
                projectArea={projectArea}
                surveyNumber={surveyNumber}
                projectName={name}
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Continue to Evidence <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Documents & Evidence */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 shadow-xs animate-fade-in">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
            Due Diligence & Evidence Uploads
          </h2>
          <p className="text-xs text-gray-500">
            Upload verified revenue land records (7/12 & 8A), baseline satellite documentation, and plantation logs.
          </p>

          <div className="space-y-3">
            {docs.map((doc, idx) => (
              <div
                key={idx}
                className="p-3.5 border border-gray-200 rounded-xl flex items-center justify-between hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      doc.uploaded ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-gray-900">{doc.name}</h4>
                    <span className="text-[11px] text-gray-400">
                      {doc.uploaded ? 'PDF Verified · Ready for certifier' : 'Pending file attachment'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggleDoc(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    doc.uploaded
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-forest-700 text-white hover:bg-forest-800'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  {doc.uploaded ? 'Uploaded ✓' : 'Upload File'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              Review & Submit <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Readiness */}
      {step === 4 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6 shadow-xs animate-fade-in">
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-1">
              Project Readiness & Submission
            </h2>
            <p className="text-xs text-gray-500">
              Verify compliance before transferring project proposal to the Accredited Carbon Verification Agency queue.
            </p>
          </div>

          {/* Readiness Bar */}
          <div className="bg-forest-50/70 border border-forest-100 rounded-xl p-4">
            <div className="flex justify-between text-xs font-semibold text-forest-900 mb-1.5">
              <span>Proposal Completeness</span>
              <span>{readinessPercent}% Ready</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-600 transition-all duration-500 rounded-full"
                style={{ width: `${readinessPercent}%` }}
              />
            </div>
          </div>

          {/* Readiness Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Project Overview & Scope Complete</span>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>7/12 Land Parcel & Coordinates Verified</span>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Baseline Satellite Boundary Polygon Mapped</span>
            </div>
            <div className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Required Legal Proof & Ownership Attached</span>
            </div>
          </div>

          {/* Summary Box */}
          <div className="border border-gray-200 rounded-xl p-4 text-xs space-y-2 bg-gray-50">
            <div className="flex justify-between font-semibold text-gray-900">
              <span>{name}</span>
              <span>{expectedCredits} tCO₂e</span>
            </div>
            <div className="text-gray-500 flex justify-between">
              <span>Location: {district}, {state} (Gat #{surveyNumber})</span>
              <span>Area: {projectArea} ha</span>
            </div>
            <div className="text-gray-500">Methodology: {methodology}</div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-4 h-4" /> Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-6 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" /> Submit for Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
