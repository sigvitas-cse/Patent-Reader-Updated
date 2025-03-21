import React, { useState } from "react";
import "./Analysis.css";
import mammoth from "mammoth";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   Routes,
// } from "react-router-dom";
// import QrCodeComponent from "./QrCodeComponent";
// import Mannual from "./Mannual";
import { useNavigate } from "react-router-dom";
// import Select from "react-select";

function Analysis() {
  const [fileName, setFileName] = useState("Not Selected");
  const [crossWord, setCrossWord] = useState("Section Not Found");
  const [fieldWord, setFieldWord] = useState("Section Not found");
  const [backgroundWord, setBackgroundWord] = useState("Section Not found");
  const [summaryWord, setSummaryWord] = useState("Section Not found");
  const [drofDraWord, setDroofDraWord] = useState("Section Not found");
  const [detaDesWord, setDetaDesWord] = useState("Section Not found");
  const [claimedWord, setClaimedWord] = useState("Section Not found");
  const [abstractWord, setAbstractWord] = useState("Section Not found");
  const [fileContent, setFileContent] = useState("");
  // const [sections, setSections] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFileContent, setShowFileContent] = useState(false);
  const [modifiedTitle, setModifiedTitle] = useState("Title Not found");
  // const [originalTitle, setOriginalTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [imgCount, setImgCount] = useState(0);
  // const [totalclaims, setTotalClaims] = useState(0);
  // const [independentClaims, setIndependentClaims] = useState(0);
  // const [dependentClaims, setDependentClaims] = useState(0);
  // const [dependentClaimNumbers, setDependentClaimNumbers] = useState(0);
  // const [paragraphsInClaims, setParagraphsInClaims] = useState(0);
  // const [paragraphCount, setParagraphCount] = useState(0);
  const [dependent, setdependent] = useState(0);
  const [independent, setIndependent] = useState(0);
  const [total, setTotal] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [showClaimContent, setShowClaimContent] = useState(false);
  const [independentClaimLists, setIndependentClaimLists] = useState("");
  const [dependentClaimLists, setDependentClaimLists] = useState("");
  // const [showQr, setShowQr] = useState(false);
  const [selectedSections, setSelectedSections] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [showDrop, setShowDrop] = useState(false);
  // const [showDropdown, setShowDropdown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sectionData, setSectionData] = useState([]);
  const [titleChar, setTitleChar] = useState(0);
  // const [isCheckAll, setIsCheckAll] = useState(false)
  const [showSummary, setShowSummary] = useState(false);
  const [fileFound, setFileFound] = useState(false);
  const navigate = useNavigate();

  //to handle the Radio Buttons
  const handleRadioChange = (event) => {
    const value = event.target.value;
    if (value === "option1") {
      setShowResult(true);
      setShowDrop(false);
    } else {
      setShowResult(false);
      setShowDrop(true);
    }
  };

  //to handle the dropdown (close/open)
  const toggleDropdown = () => {
    setIsOpen(true);
  };
  const selectAll = () => {

    setSelectedSections(sectionData.sName);

  };

  const toggleCheckbox = (sectionName) => {

    if (selectedSections.includes(sectionName)) {
      setSelectedSections(
        selectedSections.filter((name) => name !== sectionName)
      );
    } else {
      setSelectedSections([...selectedSections, sectionName]);
    }
  };

  //handle the file input
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fileWithdep = e.target.files[0].name;
    const filename = fileWithdep.replace(".docx", "");
    setFileName(filename);
    if (file) {
      setFileFound(true);
    }
    if (!file) {
      setErrorMessage("Please select a file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (e) => {
      const content = e.target.result;
      try {
        // using the library to fetch data
        const result = await mammoth.extractRawText({ arrayBuffer: content });
        const text = result.value;

        //regular expression to extract title
        const titleRegx =
          /([\s\S]*?)(cross-reference to related application|CROSS|Cross|technical|CROSS REFERENCE TO RELATED APPLICATIONS|What is claimed is|Claims|CLAIMS|WHAT IS CLAIMED IS|abstract|ABSTRACT|Cross-reference to related application|CROSS-REFERENCE TO RELATED APPLICATION|field|background|summary|description of the drawing|$)/i;
        const titlesec = titleRegx.exec(text);
        if (titlesec) {
          const titlenames = titlesec[1];
          const titlename = titlenames.replace(/\[\d+\]/g, "");

          const wordss = titlename.split(/\s+/).filter(Boolean);
          const chars = titlename.replace(/\s/g, "");
          setTitleChar(chars.length);
          setWordCount(wordss.length);
          setModifiedTitle(titlename);
        }

        const sectionData = [];
        //regular expression to extract Cross-reference
        const crossregex =
          /(?:CROSS-REFERENCE TO RELATED APPLICATION|CROSS-REFERENCE TO RELATED APPLICATIONS|CROSS REFERENCE TO RELATED APPLICATION|Cross-reference to related application|Cross-Reference To Related Application|Related Applications)([\s\S]*?)(?:TECHNICAL FIELD|FIELD|Field|Background|BACKGROUND|Summary|SUMMARY|DESCRIPTION OF (?: THE) DRAWING|Description Of(?: The)? Drawing|DETAILED DESCRIPTION|WHAT IS CLAIMED IS|ABSTRACT|$)/;

        const crosssec = crossregex.exec(text);
        if (crosssec) {
          let crosssection = crosssec[1].replace(/^\s*[A-Za-z]?\s*\n*/, "").trim();
          const filteredContentforCrossSection = crosssection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForCross = filteredContentforCrossSection
            .replace(/[^\w\s]/g, "") // Remove special characters (except spaces)
            .split(/\s+/)
            .filter(Boolean);
          const crosswordCount = wordsForCross.length;
          console.log("Raw Extracted Cross-Section Text:", JSON.stringify(crosssection));

          console.log("Extracted Cross-Section Text:", crosssection);
          console.log("Extracted Words:", wordsForCross);
          console.log("Cross-Reference Word Count:", wordsForCross.length);

          const crossCharCount = filteredContentforCrossSection.replace(/\s/g, "").length;
          const crossSentCount = filteredContentforCrossSection.split(".").length;
          const crossLineCount = filteredContentforCrossSection.split("\n").filter((line) => line.trim() !== "").length;

          const a = text.split("\n");
          const b = a.filter((line) => line.trim() !== "").length;
          const cr = crosssec[0].match(/^(.*?)(?=\n|$)/);
          const cr1 = cr[1].trim();
          sectionData.push({ sName: cr1, sCount: crosswordCount, sChar: crossCharCount, sSent: crossSentCount, sLine: crossLineCount });
          setCrossWord(crosswordCount);
          console.log("cross section word count", crosswordCount);
        }

        //regular expression to extract Field Section
        const fieldregex =
          /(?:FIELD|TECHNICAL FIELD|FIELD OF THE INVENTION|Field|Technical Field)([\s\S]*?)(?:BACKGROUND|Background|BRIEF DESCRIPTION OF THE INVENTION|Summary|SUMMARY|DESCRIPTION OF (?: THE) DRAWING|Description of (?: the) Drawing|DETAILED DESCRIPTION|detailed description|What is claimed is|CLAIMS|Abstract|ABSTRACT|CROSS-REFERENCE TO RELATED APPLICATION|$)/;
        const fieldsec = fieldregex.exec(text);
        console.log("filed count", fieldWord)
        if (fieldsec) {
          const fieldsection = fieldsec[1];
          const filteredContentforFieldSection = fieldsection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );

          const wordsForField = filteredContentforFieldSection
            .split(/\s+/)
            .filter(Boolean);
          const fieldWordCount = wordsForField.length;

          const fieldCharCount = filteredContentforFieldSection.replace(/\s/g, "").length;
          const fieldSentCount = filteredContentforFieldSection.split(".").length;
          const fieldlineCount = filteredContentforFieldSection.split("\n").filter((line) => line.trim() !== "").length;

          setFieldWord(fieldWordCount);
          const fi = fieldsec[0].match(/^(.*?)(?=\n|$)/);
          const fi1 = fi[1].trim();
          sectionData.push({ sName: fi1, sCount: fieldWordCount, sChar: fieldCharCount, sSent: fieldSentCount, sLine: fieldlineCount });
          console.log("filed count", fieldWord);
          console.log("field", fieldWordCount);
        }

        //regular expression to extract Background Section
        const backgrdregex =
          /(?:background|background of the invention)([\s\S]*?)(?:summary|brief description of the invention|description of (?: the) drawings|detailed description|what is claimed is|abstract|cross-reference to related application|field|$)/i;
        const backgrdsec = backgrdregex.exec(text);
        if (backgrdsec) {
          const backgrdsection = backgrdsec[1];
          const filteredContentforBackgrdSection = backgrdsection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForBackground = filteredContentforBackgrdSection
            .split(/\s+/)
            .filter(Boolean);
          const backgrdWordCount = wordsForBackground.length;
          const ba = backgrdsec[0].match(/^(.*?)(?=\n|$)/);
          const ba1 = ba[1].trim();
          sectionData.push({ sName: ba1, sCount: backgrdWordCount });
          setBackgroundWord(backgrdWordCount);
          console.log("back", backgrdWordCount);
        }

        //regular expression to extract Summary Section
        const summregex =
          /(?:SUMMARY|BRIEF DESCRIPTION OF THE INVENTION|BRIEF SUMMARY)([\s\S]*?)(?:DESCRIPTION OF (?: THE)? DRAWINGS|BRIEF DESCRIPTION OF DRAWINGS|detailed description|what is claimed is|claims|abstract|cross-reference to related application|field|background|$)/i;
        const summsec = summregex.exec(text);
        if (summsec) {
          const summsection = summsec[1];
          const filteredContentforSumarySection = summsection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForSummary = filteredContentforSumarySection
            .split(/\s+/)
            .filter(Boolean);
          const summaryWordCount = wordsForSummary.length;
          const su = summsec[0].match(/^(.*?)(?=\n|$)/);
          const su1 = su[1].trim();
          sectionData.push({ sName: su1, sCount: summaryWordCount });
          setSummaryWord(summaryWordCount);
          console.log("sum", summaryWordCount);
        }

        //regular expression to extract Drawing Description Section
        const dodregex =
          /(?:Description of(?: the)? Drawings|DESCRIPTION OF(?: THE)? DRAWINGS)([\s\S]*?)(?:DETAILED DESCRIPTION|\nDetailed Description|DESCRIPTION OF EMBODIMENTS|DESCRIPTION OF IMPLEMENTATIONS|DETAILED DESCRIPTION OF SPECIFIC EMBODIMENTS|What is claimed is|CLAIMS|ABSTRACT|CROSS-REFERENCE TO RELATED APPLICATION|FIELD|BACKGROUND|SUMMARY|BRIEF DESCRIPTION THE INVENTION|$)/;
        const dodsec = dodregex.exec(text);
        if (dodsec) {
          const dodsection = dodsec[1];
          const filteredContentforDodSection = dodsection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForDod = filteredContentforDodSection
            .split(/\s+/)
            .filter(Boolean);
          const dodWordCount = wordsForDod.length;
          const dd = dodsec[0].match(/^(.*?)(?=\n|$)/);
          const dd1 = dd[1].trim();
          sectionData.push({ sName: dd1, sCount: dodWordCount });
          setDroofDraWord(dodWordCount);
          console.log("dod", dodWordCount);
        }

        //regular expression to extract Detailed Description Section
        const detDesregex =
          /(?:\nDetailed Description|DETAILED DESCRIPTION|DESCRIPTION OF EMBODIMENTS|DESCRIPTION OF IMPLEMENTATIONS|DETAILED DESCRIPTION OF SPECIFIC EMBODIMENTS)([\s\S]*?)(?:What is claimed is|Claims|WHAT IS CLAIMED IS|CLAIMS|abstract|ABSTRACT|Cross-reference to related application|CROSS-REFERENCE TO RELATED APPLICATION|FIELD|BACKGROUND|SUMMARY|$)/;

        const detDessec = detDesregex.exec(text);
        if (detDessec) {
          const detDessection = detDessec[1];
          const filteredContentforDetDesSection = detDessection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForDetDes = filteredContentforDetDesSection
            .split(/\s+/)
            .filter(Boolean);
          const detDesWordCount = wordsForDetDes.length;
          const dt = detDessec[0].match(/^(.*?)(?=\n|$)/);
          const dt1 = dt[1].trim();
          sectionData.push({ sName: dt1, sCount: detDesWordCount });
          setDetaDesWord(detDesWordCount);
          console.log("det", detDesWordCount);
        }

        //regular expression to extract Claim Section
        const claimregex =
          /(?:What is claimed is|Claims|CLAIMS|WHAT IS CLAIMED IS)([\s\S]*?)(?:\babstract\b|\bABSTRACT\b|\bABSTRACT OF THE DISCLOSURE\b|Related Applications|Cross-reference to related application|CROSS-REFERENCE TO RELATED APPLICATION|FIELD|Field|BACKGROUND|SUMMARY|$)/;

        const claimsec = claimregex.exec(text);

        if (claimsec) {

          const claimsection = claimsec[1];
          const claimsection1 = claimsection.replace(
            /what is claimed is:/i,
            ""
          );
          const linesa = claimsection1
            .split(/(?<=\.)\s+/)
            .filter((line) => line.includes("."));

          const filteredLines = linesa.filter(
            (line) =>
              line.trim().length >= 40 &&
              !/^\s*[\d\n\t\s]+\.?$|^:\s*\n{1,10}CLAIMS\s*\n{1,10}1\./.test(
                line
              )
          );

          console.log("claims", linesa);
          console.log("claims1", filteredLines);

          let independentClaimCount = 0;
          let dependentClaimCount = 0;
          const independentClaims = [];
          const dependentClaims = [];
          console.log("length ", filteredLines.length);

          for (let i = 0; i < filteredLines.length; i++) {
            const line = filteredLines[i];
            console.log("line is", line);

            const words = line.split(/\s+/).filter(Boolean);
            const wordCount = words.length;
            if (/claim\s+(\d+)/i.test(line)) {
              dependentClaims.push(`claim ${i + 1} - ${wordCount} words`);
              dependentClaimCount++;
            } else {
              independentClaims.push(`claim ${i + 1} - ${wordCount} words`);
              console.log("independent claims", independentClaims);
              console.log("word counts", wordCount);
              independentClaimCount++;
            }
          }

          setTotal(filteredLines.length);
          setIndependent(independentClaimCount);
          setdependent(dependentClaimCount);
          setIndependentClaimLists(independentClaims.join("\n"));
          setDependentClaimLists(dependentClaims.join("\n "));

          const filteredContentforClaimSection = claimsection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );

          const wordsForDetClaim = filteredContentforClaimSection
            .split(/\s+/)
            .filter(Boolean);
          const claimWordCount = wordsForDetClaim.length;
          const cl = claimsec[0].match(/^(.*?)(?=\n|$)/);
          const cl1 = cl[1].trim();
          sectionData.push({ sName: cl1, sCount: claimWordCount });
          setClaimedWord(claimWordCount);
          console.log("claim", claimWordCount);
        }

        // regular expression to extract Abstract Section
        const abstractregex =
          /(?: Abstract|ABSTRACT|Abstract of the Disclosure)\s*([\s\S]*?)(?:What is claimed is|Claims|CLAIMS|CROSS-REFERENCE |cross-reference to related application|field|background|summary|description of the drawing|$)/;

        const abssec = abstractregex.exec(text);
        if (abssec) {
          let abssection = abssec[1].trim(); // Extracted abstract content

          // Remove unwanted words from the beginning
          const unwantedWords = ["OF", "THE", "DISCLOSURE"];
          abssection = abssection
            .split(/\s+/)
            .filter((word, index) => index >= 3 || !unwantedWords.includes(word.toUpperCase())) // Remove only first 3 words if matched
            .join(" ");

          // Remove numbers like [123] and standalone numbers
          const filteredContentforAbstractSection = abssection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );

          const wordsForDetAbs = filteredContentforAbstractSection
            .split(/\s+/)
            .filter(Boolean);

          const absWordCount = wordsForDetAbs.length;
          const ab = abssec[0].match(/^(.*?)(?=\n|$)/);
          const ab1 = ab ? ab[1].trim() : "Abstract";

          sectionData.push({ sName: ab1, sCount: absWordCount });
          setSectionData(sectionData);
          setAbstractWord(absWordCount);

          console.log("abstract count", absWordCount);
          console.log("Raw Extracted Abstract:", abssec[1]);  // Before processing
          console.log("Cleaned Abstract:", filteredContentforAbstractSection);  // After processing
          console.log("Word Array:", wordsForDetAbs);  // Array of words counted
          console.log("Final Word Count:", absWordCount);
        }

        console.log("ajaha", sectionData);


        // to count figures
        const figRegex =
          /(?:Description of(?: the)? Drawings|DESCRIPTION OF(?: THE)? DRAWINGS)([\s\S]*?)(?:DETAILED DESCRIPTION|\nDetailed Description|DESCRIPTION OF EMBODIMENTS|DESCRIPTION OF IMPLEMENTATIONS|DETAILED DESCRIPTION OF SPECIFIC EMBODIMENTS|What is claimed is|CLAIMS|ABSTRACT|CROSS-REFERENCE TO RELATED APPLICATION|FIELD|BACKGROUND|SUMMARY|BRIEF DESCRIPTION THE INVENTION|$)/;
        const descriptionMatches = figRegex.exec(text);
        if (descriptionMatches) {
          const descriptionText = descriptionMatches[1];

          const imageRegex1 =
            /(?:FIG(?:URE)?)\.?[-\s]?(?:\d+|[IVXLCDM]+)[A-Z]?(?:\([F\w\s]+\))?\b/gi;
          const matches = descriptionText.match(imageRegex1);
          const uniqueMatches = [...new Set(matches)];
          const matchesWithoutanyWord = uniqueMatches.filter(
            (match) =>
              !/\bfigured\b/i.test(match) && !/\bfiguring\b/i.test(match)
          );

          console.log("aa", matchesWithoutanyWord);
          const Rx1 = matchesWithoutanyWord.length;

          const figsRomanRegex =
            /FIGS(?:URES?)?\.\s(?:\d+|[IVXLCDM]+)(?:[A-Za-z]?(?:\sAND\s(?:\d+|[IVXLCDM]+)[A-Za-z]?)+)?/i;

          const matches2 = descriptionText.match(figsRomanRegex);
          const unique = [...new Set(matches2)];
          console.log("aaa", unique);
          const Rx2 = unique.length * 2;
          const totalFigs = Rx1 + Rx2;
          setImgCount(totalFigs);

          const imageRegex =
            /FIGS\.\s?\d+([A-Za-z\(\)]+)?\s?(?:to(?!.*and)|-(?!.*and))\s?\d+([A-Za-z\(\)]+)?/gi;
          const matches1 = descriptionText.match(imageRegex);
          const uniqueMatches1 = [...new Set(matches1)];
          console.log("jii", uniqueMatches1);
        }
        setFileContent(text);

        setSentenceCount(text.split(".").length);

        const lineCount = text.replace(/\n+/g, "\n").split("\n").length;

        const a = text.split("\n");
        const b = a.filter((line) => line.trim() !== "").length;
        setLineCount(b);
        setErrorMessage("");
      } catch (error) {
        setErrorMessage("Error reading the .docx file.");
      }
    };

    reader.onerror = () => {
      setErrorMessage("Error reading the file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleSummary = () => {
    setShowSummary((prevValue) => !prevValue);
  }

  return (
    <div className="App">
      <div
        style={{
          letterSpacing: 0,
          top: 0,
          width: "100%",
          backgroundColor: "",
          color: "white",
          padding: "20px",
          fontWeight: "bold",
          textDecorationColor: "#03e9f4",
        }}
      >
        <h1>Patent Reader</h1>
      </div>
      {/* <div>
        <button className="manually button" style={{marginTop}} onClick={() => navigate("/Mannual")}>Enter manually</button>
      </div> */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "gba(255, 255, 255, 0.1)" }}>
        <input type="file" accept=".docx" onChange={handleFileChange} />
        <div>
          <button className="manually button" style={{}} onClick={() => navigate("/Mannual")}>Enter manually</button>
        </div>
      </div>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {!errorMessage && fileFound ? (<>
        <div className="result" style={{ marginBottom: "4%" }}>
          <p>Title: {modifiedTitle}</p>
          <p> Word Count :{wordCount}</p>
          <p>Character Count :{titleChar}</p>
        </div>
        <div className="radio-buttons" style={{ marginBottom: "4%" }}>
          <label className="radio">
            <input
              type="radio"
              name="radioGroup"
              value="option1"
              onChange={handleRadioChange}
            />
            All Section Analysis
          </label>
          <label className="radio">
            <input
              type="radio"
              name="radioGroup"
              value="option2"
              onChange={handleRadioChange}
            />
            Specific Section Analysis
          </label>
        </div>
      </>) : <h5 style={{ color: "black" }}>Attach a word file to scan </h5>}
      {/* <div className="result" style={{ marginBottom: "4%" }}>
        <p>Title: {modifiedTitle}</p>
        <p> Word Count :{wordCount}</p>
        <p>Character Count :{titleChar}</p>
      </div>
      <div className="radio-buttons" style={{ marginBottom: "4%" }}>
        <label className="radio">
          <input
            type="radio"
            name="radioGroup"
            value="option1"
            onChange={handleRadioChange}
          />
          All Section Analysis
        </label>
        <label className="radio">
          <input
            type="radio"
            name="radioGroup"
            value="option2"
            onChange={handleRadioChange}
          />
          Specific Section Analysis
        </label>
      </div> */}
      {showResult && (
        <div className="result">
          <h3 style={{ textDecorationColor: "#03e9f4" }}>Below is the section wise total word count</h3>
          <p>Cross-Reference :<strong>{crossWord}</strong> </p>
          {/\d/.test(fieldWord) && <p>Technical Field: <strong>{fieldWord}</strong></p>}
          {/\d/.test(backgroundWord) && <p>Background : <strong>{backgroundWord}</strong></p>}
          {/\d/.test(summaryWord) && <p>Summary : <strong>{summaryWord}</strong></p>}
          {/\d/.test(drofDraWord) && <p>Description of Drawing : <strong>{drofDraWord}</strong></p>}

          <p>Total Number of Figures : <strong>{imgCount}</strong></p>

          {/\d/.test(detaDesWord) && <p>Detailed Description : <strong>{detaDesWord}</strong></p>}
          {/\d/.test(claimedWord) && <p>Claims : <strong>{claimedWord}</strong></p>}
          {/\d/.test(abstractWord) && <p>Abstract : <strong>{abstractWord}</strong></p>}
          {/* {/\d/.test(lineCount) && <p>Total lines: <strong>{lineCount}</strong></p>} */}

          <button onClick={handleSummary}>{showSummary ? "Close the summary Of calculations" : "Click here to view summary of the calculations"}</button>
          {showSummary && (<>
            <p>Total lines : <strong>{lineCount}</strong></p>
            <p>
              Total word count : <strong>{fileContent.split(/\s+/).filter(Boolean).length}</strong>
            </p>
            <p>Total character count : <strong>{fileContent.replace(/\s/g, "").length}</strong></p>
            <p>Total sentence count : <strong>{sentenceCount}</strong></p> </>)}
        </div>
      )}
      {showDrop && (
        <div>
          <div>
            <details className="custom-dropdown" style={{ marginBottom: '4%', width: "100%" }}>
              <summary onClick={toggleDropdown}>Select Sections</summary>
              {isOpen && (
                <ul className="custom-dropdown-list">
                  {/* <div>
                    <label>
                      <input
                      type="checkbox"
                      name="selectAll"
                      id="selectAll"
                      onChange = {()=>toggleCheckbox((e)=>e.section.sName)}
                      checked = {isCheckAll}
                      />
                      <span style={{marginLeft:'10px'}}>Select All</span>
                    </label>
                  </div> */}

                  {sectionData.map((section, index) => (
                    <li key={index}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selectedSections.includes(section.sName)}
                          onChange={() => toggleCheckbox(section.sName)}
                        />
                        <span style={{ marginLeft: '10px' }}>{section.sName}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </div>
          <div className="result">
            <div style={{
              textDecorationColor: "#0a0909",
              marginBottom: '2%',
              fontWeight: "bold",
            }}>
              Word Count of Selected Sections:
            </div>
            {selectedSections.map((sectionName, index) => {
              const selectedSection = sectionData.find(
                (section) => section.sName === sectionName
              );
              return (
                <div key={index}>
                  {`${selectedSection.sName} : `}
                  <strong>{selectedSection.sCount}</strong>
                </div>
              );
            })}

          </div>
        </div>
      )}

      {fileFound && !errorMessage && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "2%",
            }}
          >
            <div>
              <button onClick={() => setShowFileContent(!showFileContent)}>
                {showFileContent ? "hide" : "view"} content
              </button>
            </div>
            <div>
              <button onClick={() => setShowClaimContent(!showClaimContent)}>
                {showClaimContent ? "hide" : "view"} Claims
              </button>
            </div>

          </div>
        </>
      )}
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "2%",
        }}
      >
        <div>
          <button onClick={() => setShowFileContent(!showFileContent)}>
            {showFileContent ? "hide" : "view"} content
          </button>
        </div>
        <div>
          <button onClick={() => setShowClaimContent(!showClaimContent)}>
            {showClaimContent ? "hide" : "view"} Claims
          </button>
        </div>

      </div> */}

      {showFileContent && (
        <div className="file-content" style={{ textAlign: "center" }}>
          <h2
            style={{
              color: "black",
              textDecorationColor: "#03e9f4",
            }}
          >
            File Content : {"  " + fileName}
          </h2>
          <p
            style={{
              whiteSpace: "pre-wrap",
              textAlign: "left",
              backgroundColor: "white",
              margin: "0",
            }}
          >
            {fileContent
              .split("\n")
              .reduce((acc, line) => {
                const trimmedLine = line.trim();
                const modifiedLine = trimmedLine.replace(
                  /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
                  ""
                );
                if (modifiedLine) {
                  acc.push(modifiedLine);
                } else if (!acc[acc.length - 1]) {
                  return acc;
                } else {
                  acc.push("");
                }
                return acc;
              }, [])
              .join("\n")}
          </p>
        </div>
      )}

      {showClaimContent && (
        <div className="claim-content">
          <h2>CLAIMS:</h2>
          <p>Total Claims:{total}</p>
          <p>Independent Claims:{independent}</p>
          <p>Dependent Claims:{dependent}</p>
          <p>
            <b>Independent Claims List:</b>
          </p>
          <pre style={{ color: "white", backgroundColor: "GrayText" }}>{independentClaimLists}</pre>
          <p>
            <b>Dependent Claims:</b>
          </p>
          <pre style={{ color: "white", backgroundColor: "GrayText" }}>{dependentClaimLists}</pre>
        </div>
      )}
    </div>
  );
}

export default Analysis;
