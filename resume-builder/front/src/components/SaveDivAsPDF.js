import React from 'react';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import './SaveDivAsPDF.css'

class SaveDivAsPDF extends React.Component {

  saveAsPDF = () => {
    const input = document.getElementById(this.props.divId);
    html2canvas(input, { scale: 3 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // set PDF size to A4
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();
        const canvasAspectRatio = canvas.width / canvas.height;
        const pageAspectRatio = width / height;
        let scale;
        if (canvasAspectRatio > pageAspectRatio) {
          scale = width / canvas.width;
        } else {
          scale = height / canvas.height;
        }
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * scale, canvas.height * scale);
        pdf.save("download.pdf");
      });
  }


  render() {
    return (
      <button onClick={this.saveAsPDF} id='SaveButton'>Save as PDF</button>
    );
  }
}

export default SaveDivAsPDF;
