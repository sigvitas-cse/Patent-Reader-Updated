// import React, { useEffect, useRef } from 'react';
// import qrCode from 'qrcode';

// const QrCodeComponent = ({ answers }) => {
//   const qrCodeRef = useRef(null);

//   useEffect(() => {
//     if (qrCodeRef.current) {
//       const canvas = qrCodeRef.current;
//       const data = JSON.stringify(answers); 
// console.log("ans",answers);
// // Convert answers to JSON string for QR code
//       qrCode.toCanvas(canvas, data, function (error) {
//         if (error) console.error('Error generating QR code:', error);
//       });
//     }
//   }, [answers]);

//   return (
//     <div>
//       <canvas ref={qrCodeRef} />
//     </div>
//   );
// };

// export default QrCodeComponent;


// import React, { useRef, useEffect } from 'react';
// import QRCode from 'qrcode';

// const QrCodeComponent = ({ answers,size }) => {
//   const qrCodeRef = useRef(null);

//   useEffect(() => {
//     const qrData = answers;
//     if (qrCodeRef.current && qrData) {
//       const canvas = qrCodeRef.current;
//       const options ={
// erroeCorrectionLevel:'H',
// width: size,
//         height: size

//       };
//       QRCode.toCanvas(canvas, qrData, function (error) {
//         if (error) console.error('Error generating QR code:', error);
//       });
//     }
//   }, [answers]);

//   return (
//     <div>
//       <canvas ref={qrCodeRef} />
//     </div>
//   );
// };

// export default QrCodeComponent;
import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';

const QrCodeComponent = ({ answers, size }) => {
  const [isLoading, setIsLoading] = useState(true);
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const qrData = answers;
    if (qrCodeRef.current && qrData) {
      const canvas = qrCodeRef.current;
      const options = {
        errorCorrectionLevel: 'H',
        width: size,
        height: size,
      };

      QRCode.toCanvas(canvas, qrData, options, function (error) {
        if (error) console.error('Error generating QR code:', error);
        setIsLoading(false); 
      });
    }
  }, [answers, size]);

  return (
    <div className="qr-code-container">
      {isLoading && <div className="loading-overlay">Generating QR code...</div>}
      <canvas ref={qrCodeRef} />
    </div>
  );
};

export default QrCodeComponent;










