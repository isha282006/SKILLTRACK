import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import resumeService from '../../services/resumeService';

const ResumeUploadReview = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Parsed State
  const [parsedResult, setParsedResult] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg('');
      setSuccessMsg('');
    }
  };

  const handleUploadAndParse = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg('Please select a PDF or DOCX resume to upload.');
      return;
    }

    setErrorMsg('');
    setUploading(true);

    try {
      const res = await resumeService.uploadResume(file);
      const payload = res.data || res;
      const parsed = payload.parsedData || res.parsedData;
      if (res.success && parsed) {
        setParsedResult(payload);
        const rawSkills = parsed.allSkills || (parsed.skills?.all || []).map(name => ({ name, category: 'Technical Skills' }));
        const initialSelected = rawSkills.map(s => ({
          name: typeof s === 'string' ? s : s.name,
          category: s.category || 'Technical Skills',
          proficiency_level: s.proficiency_level || s.proficiency || 'Intermediate',
          years_of_experience: s.years_of_experience || 1.0,
          selected: true
        }));
        setSelectedSkills(initialSelected);
        setSuccessMsg(`Document processed via AST tokenizer. Detected ${initialSelected.length} competencies across tech taxonomy.`);
      } else {
        setErrorMsg(res.message || 'Failed to parse resume document.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error processing document. Ensure standard PDF/DOCX format.');
    } finally {
      setUploading(false);
    }
  };

  const toggleSkillSelection = (index) => {
    setSelectedSkills(prev => {
      const updated = [...prev];
      updated[index].selected = !updated[index].selected;
      return updated;
    });
  };

  const handleProficiencyChange = (index, level) => {
    setSelectedSkills(prev => {
      const updated = [...prev];
      updated[index].proficiency_level = level;
      return updated;
    });
  };

  const handleConfirmSkills = async () => {
    const toImport = selectedSkills.filter(s => s.selected).map(s => ({
      name: s.name,
      category: s.category,
      proficiency_level: s.proficiency_level
    }));

    if (toImport.length === 0) {
      setErrorMsg('Please select at least one skill to import into your Skills Matrix.');
      return;
    }

    setSavingSkills(true);
    setErrorMsg('');

    try {
      const res = await resumeService.confirmSkills(toImport);
      if (res.success) {
        setSuccessMsg(`Successfully imported ${toImport.length} verified competencies to MySQL repository. Recalculating readiness score...`);
        setTimeout(() => {
          navigate('/student/skills');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to persist confirmed competencies.');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Error saving skills to profile.');
    } finally {
      setSavingSkills(false);
    }
  };

  return (
    <div className="resume-upload-review pb-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 mb-4 border-bottom border-lab-black pb-3">
        <div>
          <div className="font-mono text-muted" style={{ fontSize: '0.7rem', letterSpacing: '0.08em' }}>
            // INSTITUTIONAL CAREER INTELLIGENCE &bull; SECTION 03
          </div>
          <h2 className="font-editorial text-dark mb-0 fw-bold" style={{ letterSpacing: '-0.03em' }}>
            Resume Parser &amp; NLP Recognizer
          </h2>
          <p className="text-secondary small mb-0 font-sans">
            Automated PDF/DOCX tokenization, candidate profile extraction, and competency matching.
          </p>
        </div>
        <NavLink to="/student/skills" className="btn-lab-sm btn-lab-sm-outline text-decoration-none">
          <i className="fas fa-cubes"></i>
          <span>[VIEW CURRENT MATRIX]</span>
        </NavLink>
      </div>

      {errorMsg && (
        <div className="p-3 mb-4 bg-danger bg-opacity-10 border border-danger d-flex align-items-center gap-2 font-mono small text-danger">
          <i className="fas fa-circle-exclamation"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 mb-4 bg-lab-lime border border-lab-black d-flex align-items-center gap-2 font-mono small text-dark">
          <i className="fas fa-check-circle"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Zone Card */}
      <div className="card-editorial p-4 p-md-5 mb-4">
        <form onSubmit={handleUploadAndParse}>
          <div
            className="p-5 text-center border-lab-black"
            style={{
              backgroundColor: '#FAF8F5',
              border: '2px dashed #111827'
            }}
          >
            <div
              className="d-inline-flex align-items-center justify-content-center font-mono fw-bold mb-3"
              style={{
                width: '64px',
                height: '64px',
                backgroundColor: '#111827',
                color: '#C5F36B',
                border: '1px solid #111827',
                fontSize: '1.5rem'
              }}
            >
              <i className="fas fa-file-arrow-up"></i>
            </div>
            <h4 className="font-editorial fw-bold text-dark mb-1">INTAKE RESUME DOCUMENT</h4>
            <p className="text-muted small font-mono mb-4">
              SUPPORTED FORMATS: PDF (PORTABLE DOCUMENT FORMAT) &bull; DOCX (OPENXML WORD). MAX 10MB.
            </p>

            <div className="d-flex justify-content-center mb-3">
              <input
                type="file"
                id="resumeFileInput"
                className="d-none"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
              />
              <label
                htmlFor="resumeFileInput"
                className="btn-lab-sm btn-lab-sm-navy"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1.75rem', cursor: 'pointer' }}
              >
                <i className="fas fa-folder-open me-1"></i>
                <span>{file ? file.name : '[SELECT FILE FROM DISK]'}</span>
              </label>
            </div>

            {file && (
              <div className="d-inline-flex align-items-center gap-2 bg-white px-3 py-2 border border-lab-black font-mono small text-dark mb-3">
                <i className="fas fa-file-pdf text-danger"></i>
                <span className="fw-bold">{file.name}</span>
                <span className="text-muted">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={!file || uploading}
                className="btn-lab-sm btn-lab-sm-lime"
                style={{ fontSize: '0.85rem', padding: '0.75rem 2rem' }}
              >
                {uploading ? (
                  <span className="d-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>[PARSING DOCUMENT AST &bull; EXTRACTING SKILLS...]</span>
                  </span>
                ) : (
                  <span>[EXECUTE PARSER &bull; EXTRACT COMPETENCIES]</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Review Section */}
      {parsedResult && parsedResult.parsedData && (
        <div className="review-section">
          <div className="card-editorial p-4 p-md-5 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2 mb-4 border-b-lab pb-3">
              <div>
                <span className="font-mono text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                  // STAGE 02: CONFIRMATION MATRIX &bull; {parsedResult.filename}
                </span>
                <h4 className="font-editorial fw-bold text-dark mb-0">Detected Candidate Dossier</h4>
              </div>
              <span className="badge-editorial badge-editorial-lime">
                <i className="fas fa-check-double me-1"></i> NLP EXTRACTION COMPLETE
              </span>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="p-3 bg-lab-ivory-light border border-lab-black">
                  <span className="font-mono text-muted small d-block" style={{ fontSize: '0.65rem' }}>// DETECTED CANDIDATE</span>
                  <strong className="font-editorial text-dark">{parsedResult.parsedData.candidateName || 'Candidate Profile'}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-lab-ivory-light border border-lab-black">
                  <span className="font-mono text-muted small d-block" style={{ fontSize: '0.65rem' }}>// DETECTED EMAIL</span>
                  <strong className="font-mono text-dark small">{parsedResult.parsedData.email || 'N/A'}</strong>
                </div>
              </div>
              <div className="col-md-4">
                <div className="p-3 bg-lab-ivory-light border border-lab-black">
                  <span className="font-mono text-muted small d-block" style={{ fontSize: '0.65rem' }}>// DETECTED PHONE</span>
                  <strong className="font-mono text-dark small">{parsedResult.parsedData.phone || 'N/A'}</strong>
                </div>
              </div>
            </div>

            {/* Extracted Education & Projects */}
            <div className="row g-3 mb-4">
              {parsedResult.parsedData.education && parsedResult.parsedData.education.length > 0 && (
                <div className="col-md-6">
                  <div className="p-3 bg-white border border-lab-black h-100">
                    <div className="font-mono fw-bold text-dark mb-2 small">// DETECTED ACADEMICS</div>
                    <ul className="list-unstyled font-mono small mb-0 d-flex flex-column gap-1">
                      {parsedResult.parsedData.education.map((item, idx) => (
                        <li key={idx} className="text-secondary">
                          &bull; {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {parsedResult.parsedData.projects && parsedResult.parsedData.projects.length > 0 && (
                <div className="col-md-6">
                  <div className="p-3 bg-white border border-lab-black h-100">
                    <div className="font-mono fw-bold text-dark mb-2 small">// DETECTED KEY PROJECTS</div>
                    <ul className="list-unstyled font-mono small mb-0 d-flex flex-column gap-1">
                      {parsedResult.parsedData.projects.map((item, idx) => (
                        <li key={idx} className="text-secondary">
                          &bull; {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Competency Table */}
            <div className="border-t-lab pt-4">
              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mb-3">
                <div>
                  <h5 className="font-editorial fw-bold text-dark mb-0">Confirm Extracted Competencies</h5>
                  <p className="font-mono text-muted small mb-0" style={{ fontSize: '0.7rem' }}>
                    TOGGLE SKILLS TO INCLUDE AND ADJUST PROFICIENCY RATINGS BEFORE COMMITTING TO MYSQL.
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn-lab-sm btn-lab-sm-outline"
                    onClick={() => setSelectedSkills(prev => prev.map(s => ({ ...s, selected: true })))}
                  >
                    [SELECT ALL]
                  </button>
                  <button
                    type="button"
                    className="btn-lab-sm btn-lab-sm-outline"
                    onClick={() => setSelectedSkills(prev => prev.map(s => ({ ...s, selected: false })))}
                  >
                    [DESELECT ALL]
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table-editorial">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>STATE</th>
                      <th>SKILL / COMPETENCY</th>
                      <th>CATEGORY TAXONOMY</th>
                      <th>PROFICIENCY LEVEL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSkills.map((item, index) => (
                      <tr key={index} style={{ opacity: item.selected ? 1 : 0.4 }}>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSkillSelection(index)}
                            style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td className="fw-bold font-editorial text-dark">{item.name}</td>
                        <td>
                          <span className="badge-editorial badge-editorial-ivory">
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <select
                            className="form-control-editorial py-1 px-2 font-mono"
                            style={{ width: '160px', fontSize: '0.75rem' }}
                            value={item.proficiency_level}
                            disabled={!item.selected}
                            onChange={(e) => handleProficiencyChange(index, e.target.value)}
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-wrap justify-content-end gap-3 mt-4 pt-3 border-t-lab">
                <button
                  type="button"
                  onClick={() => navigate('/student/resume/review', { state: { parsedData: parsedResult?.parsedData || parsedResult, filename: file?.name || 'Uploaded Resume' } })}
                  className="btn-lab-sm btn-lab-sm-outline"
                >
                  <i className="fas fa-sliders me-1"></i>
                  <span>[DETAILED REVIEW STUDIO]</span>
                </button>
                <button
                  type="button"
                  disabled={savingSkills}
                  onClick={handleConfirmSkills}
                  className="btn-lab-sm btn-lab-sm-lime"
                  style={{ fontSize: '0.85rem', padding: '0.75rem 2rem' }}
                >
                  {savingSkills ? (
                    <span className="d-flex align-items-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      <span>[COMMITTING TO DATABASE...]</span>
                    </span>
                  ) : (
                    <span>[CONFIRM &amp; SYNC WITH SKILLS MATRIX]</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUploadReview;
