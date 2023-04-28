import React, { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc } from "firebase/firestore";

function CustomerReport() {
  const [reportData, setReportData] = useState({ 
    userName: '',
    reason: '', 
    reportingName: '', 
    reportingItem: '',
    reportingList: '',
    date: '' });

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send data to Firebase collection
      await addDoc(collection(db, 'customerReport'), reportData);
      console.log('Report submitted:', reportData);
      setReportData({ userName: '', reason: '', reportingName: '', reportingItem: '', reportingList: '', date: '' });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div>
      <br />
      <form onSubmit={handleSubmit} style={{ background: 'linear-gradient(180deg, rgba(149, 185, 178, 0.9) 0%, rgba(233, 221, 192, 0.9) 100%)', borderRadius: '50px', padding: '20px', display: 'inline-block', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Report User</h2>
        <label>
          Name of user reporting:  
          <input type="text" value={reportData.userName} onChange={(event) => setReportData({ ...reportData, userName: event.target.value })} required />
        </label>
        <br />
        <br />
        <label>
          Reason for reporting:
          <input type="text" value={reportData.reason} onChange={(event) => setReportData({ ...reportData, reason: event.target.value })} required />
        </label>
        <br />
        <br />
        <label>
          Any user concerned about:
          <input type="text" value={reportData.reportingName} onChange={(event) => setReportData({ ...reportData, reportingName: event.target.value })} required />
        </label>
        <br />
        <br />
        <label>
          Any item concerned about:
          <input type="text" value={reportData.reportingItem} onChange={(event) => setReportData({ ...reportData, reportingItem: event.target.value })} required />
        </label>
        <br />
        <br />
        <label>
          Any list concerned about:
          <input type="text" value={reportData.reportingList} onChange={(event) => setReportData({ ...reportData, reportingList: event.target.value })} required />
        </label>
        <br />
        <br />
        <label>
          Date:
          <input type="date" value={reportData.date} onChange={(event) => setReportData({ ...reportData, date: event.target.value })} required />
        </label>
        <br />
        <br />
        <button type="submit" onClick={() => setReportData({ userName: '', date: '', reason: '' })} style={{borderRadius: '5px', padding: '10px', border: 'none', color: '#84ad97', cursor: 'pointer', background: 'transparent', marginRight: 'auto' }}><h2 style={{ margin: '0', fontSize: '16px' }}>Cancel</h2></button>
        <button type="submit" style={{borderRadius: '5px', padding: '10px', border: 'none', color: '#84ad97', cursor: 'pointer', background: 'transparent', marginLeft: 'auto' }}><h2 style={{ margin: '0', fontSize: '16px' }}>Report</h2></button>
      </form>
      <br />
      <br />
    </div>
  );
}

export default CustomerReport;
