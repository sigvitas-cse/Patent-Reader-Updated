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
import PizZip from "pizzip";
import { saveAs } from "file-saver";
import FileUpload from "./components/FileUpload";
import WordReplacementSelector from "./components/WordReplacementSelector";
import WordCountsTable from "./components/WordCountsTable";
import Confirmation from "./components/Confirmation";

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

  // State variables to manage file input, errors, word counts, matched words, confirmation status, and the updated file
  const [file, setFile] = useState(null); // The uploaded .docx file
  const [error, setError] = useState(null); // Error messages
  const [wordCounts, setWordCounts] = useState({}); // Counts of each matched predefined word
  const [matchedWords, setMatchedWords] = useState({}); // Matched predefined words and their replacements
  const [confirmationNeeded, setConfirmationNeeded] = useState(false); // Flag to show confirmation before download
  const [updatedFile, setUpdatedFile] = useState(null); // The updated .docx file after replacements
  const [matchedKeys, setMatchedKeys] = useState([]); // Array of predefined words that were matched in the document
  const [replacementSelections, setReplacementSelections] = useState({}); // User-selected replacements for each predefined word
  const [showReplacementSelector, setShowReplacementSelector] = useState(false); // Flag to show replacement selection UI
  const [claimTermCounts, setClaimTermCounts] = useState({}); // Counts of each matched claim-specific term
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showProfanity, setShowProfanity] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isAbstractHovered, setIsAbstractHovered] = useState(false);
  const [showIndependentClaim, setShowIndependentClaim] = useState(false);
  const [showDependentClaim, setShowDependentClaim] = useState(false);
  //setting word limits for each section
  const abstractWordLimit = 150;
  const backgroundWordLimit = 500;
  const summaryWordLimit = 800;

  //mentioning the conditions
  const isAbstractExceeding = abstractWord > abstractWordLimit;
  const isAbackgroundExceeding = backgroundWord > backgroundWordLimit;
  const isSummaryExceeding = summaryWord > summaryWordLimit;

  // Predefined words to search for and their replacement options
  const predefinedWords = {
    Above: ["Surpassing", "Beyond"],
    "Adapted For": ["Altered for", "Modified for"],
    "Adapted To": ["Made adjustments to", "Modified to"],
    All: ["The total", "Every single"],
    Always: ["Perpetually", "Invariably"],
    Allow: ["Permit", "Grant"],
    Appropriately: ["Accordingly", "Fittingly"],
    Authoritative: ["Attested", "Authenticated"],
    Approximate: ["Closer", "Almost"],
    Around: ["On all sides", "Throughout"],
    Below: ["Less than", "Lower than"],
    Big: ["Oversize", "Hefty"],
    Best: ["Perfect", "Ace", "Incomparable"],
    Biggest: ["Largest", "Huge"],
    Bigger: ["Greater", "Heftier"],
    "Black Hat": ["Cybercriminal", "Cracker"],
    But: ["Although", "In spite"],
    "By Necessity": ["Obligatory", "Inescapable"],
    "Black List": ["Ban list", "Prohibited list"],
    Broadest: ["Spacious", "Widespread"],
    Certain: ["Undoubtful", "Assertively"],
    Certainly: ["Exactly", "Assertively"],
    "Characterized By": ["Defined by", "Recognised by"],
    Chief: ["Head", "First"],
    "Chinese Wall": ["Information Partition", "Ethical barrier"],
    Compel: ["Enforce", "Urge"],
    Clearly: ["Noticeably", "Undoubtedly"],
    Completely: ["To the limit", "Fully"],
    Compelled: ["Bound", "Forced"],
    "Composed Of": ["Involving", "Constructed from"],
    Compelling: ["Forcing"],
    Every: ["each"],
  };

  // Claim-specific terms to search and highlight in red
  const claimSpecificTerms = [
    "at least one",
    "at least two",
    "one or more",
    "plurality of",
    "wherein",
  ];

  const navigate = useNavigate();

  // Function to escape special regex characters in a string
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

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
      setFile(file); // Set the selected file
      setWordCounts({}); // Reset word counts
      setMatchedWords({}); // Reset matched words
      setConfirmationNeeded(false); // Reset confirmation flag
      setUpdatedFile(null); // Reset updated file
      setError(null); // Reset any existing errors
      setMatchedKeys([]); // Reset matched keys
      setReplacementSelections({}); // Reset replacement selections
      setShowReplacementSelector(false); // Hide replacement selector UI
      setClaimTermCounts({}); // Reset claim term counts
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

        const titleRegx =
          /([\s\S]*?)(cross-reference to related application|CROSS|Cross|technical|CROSS REFERENCE TO RELATED APPLICATIONS|What is claimed is|Claims|CLAIMS|WHAT IS CLAIMED IS|abstract|ABSTRACT|Cross-reference to related application|CROSS-REFERENCE TO RELATED APPLICATION|field|background|summary|description of the drawing|$)/i;
        const titlesec = titleRegx.exec(text);

        let titlename = "";

        if (titlesec) {
          titlename = titlesec[1].replace(/\[\d+\]/g, "");
        }

        // Improved "(54)" section extraction (stops at next heading in parentheses)
        const titleMatch = text.match(
          /\(54\)\s*([\s\S]+?)(?=\(\d+\)|References Cited|U\.S\. PATENT DOCUMENTS|DIFFERENT ROUGHNESS|$)/i
        );

        if (titleMatch) {
          titlename = titleMatch[1].trim();
        }

        const wordss = titlename.split(/\s+/).filter(Boolean);
        const chars = titlename.replace(/\s/g, "");

        setTitleChar(chars.length);
        setWordCount(wordss.length);
        setModifiedTitle(titlename);

        const sectionData = [];
        //regular expression to extract Cross-reference
        const crossregex =
          /(?:CROSS-REFERENCE TO RELATED APPLICATION|CROSS-REFERENCE TO RELATED APPLICATIONS|CROSS REFERENCE TO RELATED APPLICATION|Cross-reference to related application|Cross-Reference To Related Application|Related Applications)([\s\S]*?)(?:TECHNICAL FIELD|FIELD|Field|Background|BACKGROUND|Summary|SUMMARY|DESCRIPTION OF (?: THE) DRAWING|Description Of(?: The)? Drawing|DETAILED DESCRIPTION|WHAT IS CLAIMED IS|ABSTRACT|$)/;

        const crosssec = crossregex.exec(text);
        if (crosssec) {
          let crosssection = crosssec[1]
            .replace(/^\s*[A-Za-z]?\s*\n*/, "")
            .trim();
          const filteredContentforCrossSection = crosssection.replace(
            /\[\d+\]|\b(?:[1-4]|[6-9])?\d{1,}(?:(?<!\[\d+)\b5\b)?\b/g,
            ""
          );
          const wordsForCross = filteredContentforCrossSection
            .replace(/[^\w\s]/g, "") // Remove special characters (except spaces)
            .split(/\s+/)
            .filter(Boolean);
          const crosswordCount = wordsForCross.length;
          console.log(
            "Raw Extracted Cross-Section Text:",
            JSON.stringify(crosssection)
          );

          console.log("Extracted Cross-Section Text:", crosssection);
          console.log("Extracted Words:", wordsForCross);
          console.log("Cross-Reference Word Count:", wordsForCross.length);

          const crossCharCount = filteredContentforCrossSection.replace(
            /\s/g,
            ""
          ).length;
          const crossSentCount =
            filteredContentforCrossSection.split(".").length;
          const crossLineCount = filteredContentforCrossSection
            .split("\n")
            .filter((line) => line.trim() !== "").length;

          const a = text.split("\n");
          const b = a.filter((line) => line.trim() !== "").length;
          const cr = crosssec[0].match(/^(.*?)(?=\n|$)/);
          const cr1 = cr[1].trim();
          sectionData.push({
            sName: cr1,
            sCount: crosswordCount,
            sChar: crossCharCount,
            sSent: crossSentCount,
            sLine: crossLineCount,
          });
          setCrossWord(crosswordCount);
          console.log("cross section word count", crosswordCount);
        }

        //regular expression to extract Field Section
        const fieldregex =
          /(?:FIELD|TECHNICAL FIELD|FIELD OF THE INVENTION|Field|Technical Field)([\s\S]*?)(?:BACKGROUND|Background|BRIEF DESCRIPTION OF THE INVENTION|Summary|SUMMARY|DESCRIPTION OF (?: THE) DRAWING|Description of (?: the) Drawing|DETAILED DESCRIPTION|detailed description|What is claimed is|CLAIMS|Abstract|ABSTRACT|CROSS-REFERENCE TO RELATED APPLICATION|$)/;
        const fieldsec = fieldregex.exec(text);
        console.log("filed count", fieldWord);
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

          const fieldCharCount = filteredContentforFieldSection.replace(
            /\s/g,
            ""
          ).length;
          const fieldSentCount =
            filteredContentforFieldSection.split(".").length;
          const fieldlineCount = filteredContentforFieldSection
            .split("\n")
            .filter((line) => line.trim() !== "").length;

          setFieldWord(fieldWordCount);
          const fi = fieldsec[0].match(/^(.*?)(?=\n|$)/);
          const fi1 = fi[1].trim();
          sectionData.push({
            sName: fi1,
            sCount: fieldWordCount,
            sChar: fieldCharCount,
            sSent: fieldSentCount,
            sLine: fieldlineCount,
          });
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
            const wordCount = words.length - 1;
            console.log("claim word count", wordCount);

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
            .filter(
              (word, index) =>
                index >= 3 || !unwantedWords.includes(word.toUpperCase())
            ) // Remove only first 3 words if matched
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

          // console.log("is Exceeding checking",isExceeding);

          console.log("abstract count", absWordCount);
          console.log("Raw Extracted Abstract:", abssec[1]); // Before processing
          console.log("Cleaned Abstract:", filteredContentforAbstractSection); // After processing
          console.log("Word Array:", wordsForDetAbs); // Array of words counted
          console.log("Final Word Count:", absWordCount);
        }

        console.log("is Exceeding checking", isAbstractExceeding);

        console.log("ajaha", sectionData);

        // to count figures
        const figRegex =
          /(?:Description of(?: the)? Drawings|DESCRIPTION OF(?: THE)? DRAWINGS)([\s\S]*?)(?:DETAILED DESCRIPTION|\nDetailed Description|DESCRIPTION OF EMBODIMENTS|DESCRIPTION OF IMPLEMENTATIONS|DETAILED DESCRIPTION OF SPECIFIC EMBODIMENTS|What is claimed is|CLAIMS|ABSTRACT|CROSS-REFERENCE TO RELATED APPLICATION|FIELD|BACKGROUND|SUMMARY|BRIEF DESCRIPTION THE INVENTION|$)/;
        const descriptionMatches = figRegex.exec(text);
        console.log("inside counting figures", descriptionMatches);

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
  };

  // Handler for the "Search and Replace" button click
  const handleSearchReplace = async () => {
    if (file) {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const arrayBuffer = e.target.result; // Get the file content as an array buffer
          const uint8Array = new Uint8Array(arrayBuffer); // Convert to Uint8Array

          let zip;
          try {
            zip = new PizZip(uint8Array);
          } catch (zipError) {
            console.error("PizZip Error:", zipError);
            setError(
              "Failed to parse the .docx file. Please ensure it is a valid and uncorrupted file."
            );
            return;
          }

          // Read 'word/document.xml' from the zip
          const documentXml = zip.file("word/document.xml");
          if (!documentXml) {
            setError("Invalid .docx file: Missing word/document.xml");
            return;
          }

          const xmlString = documentXml.asText();

          // Parse the XML content
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, "application/xml");

          const wNamespace =
            "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

          // Initialize variables to keep track of counts and matched words
          let counts = {};
          let matchedKeysArray = [];
          let claimCounts = {};
          let matchedClaimKeysArray = [];

          let isInDetailedDescription = false; // Flag to track if currently in "Detailed Description" section

          // Recursive function to traverse XML nodes
          const traverseNodes = (nodes) => {
            for (let i = 0; i < nodes.length; i++) {
              const node = nodes[i];

              // Check for paragraphs to process
              if (node.nodeName === "w:p") {
                // Determine if this paragraph is a heading for "Detailed Description"
                const isHeading = isParagraphHeading(
                  node,
                  xmlDoc,
                  "Detailed Description"
                );

                if (isHeading) {
                  isInDetailedDescription = true; // Entering "Detailed Description" section
                  console.log("inside detailed description");
                  continue; // Skip processing the heading paragraph itself
                }

                // Process the paragraph to find matches
                processParagraph(node, isInDetailedDescription);
                continue; // Continue to the next node
              }

              // Recursively traverse child nodes
              if (node.childNodes && node.childNodes.length > 0) {
                traverseNodes(node.childNodes);
              }
            }
          };

          // Function to determine if a paragraph is a heading with specific text
          const isParagraphHeading = (paragraphNode, xmlDoc, headingText) => {
            const paragraphText = getParagraphText(paragraphNode, xmlDoc)
              .trim()
              .toLowerCase();
            // console.log("paragraph text is ", paragraphText);
            return paragraphText === headingText.toLowerCase();
          };

          // Function to extract the full text content of a paragraph
          const getParagraphText = (paragraphNode, xmlDoc) => {
            let text = "";
            const runs = paragraphNode.getElementsByTagName("w:t");
            for (let i = 0; i < runs.length; i++) {
              text += runs[i].textContent;
            }
            return text;
          };

          // Function to process a paragraph and find matches
          const processParagraph = (paragraphNode, isDetailedDescription) => {
            // Collect all runs and their text content
            let runs = [];
            let concatenatedText = "";
            let runPositions = []; // Array of objects with start and end indices

            const paragraphChildNodes = paragraphNode.childNodes;
            for (let j = 0; j < paragraphChildNodes.length; j++) {
              const child = paragraphChildNodes[j];
              if (child.nodeName === "w:r") {
                let runText = "";
                let xmlSpacePreserve = false;

                for (let k = 0; k < child.childNodes.length; k++) {
                  const grandChild = child.childNodes[k];
                  if (grandChild.nodeName === "w:t") {
                    // Check if xml:space="preserve" is set
                    if (grandChild.getAttribute("xml:space") === "preserve") {
                      xmlSpacePreserve = true;
                    }
                    runText += grandChild.textContent;
                  }
                }

                // Include runs even if they contain only whitespace
                runs.push({
                  node: child,
                  text: runText,
                  xmlSpacePreserve: xmlSpacePreserve,
                });

                const startIndex = concatenatedText.length;
                concatenatedText += runText;
                const endIndex = concatenatedText.length;
                runPositions.push({
                  start: startIndex,
                  end: endIndex,
                  runIndex: runs.length - 1,
                });
              }
            }

            if (runs.length === 0) return; // No runs to process

            // Perform searches to identify matched predefined words
            for (const key of Object.keys(predefinedWords)) {
              let regex;
              if (/\W/.test(key)) {
                regex = new RegExp(escapeRegExp(key), "gi");
              } else {
                regex = new RegExp(`\\b${escapeRegExp(key)}\\b`, "gi");
              }

              let match;
              while ((match = regex.exec(concatenatedText)) !== null) {
                counts[key] = (counts[key] || 0) + 1;
                if (!matchedKeysArray.includes(key)) {
                  matchedKeysArray.push(key);
                }
              }
            }

            // If in "Detailed Description", search for claim-specific terms
            if (isDetailedDescription) {
              for (const term of claimSpecificTerms) {
                let regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
                let match;
                while ((match = regex.exec(concatenatedText)) !== null) {
                  claimCounts[term] = (claimCounts[term] || 0) + 1;
                  if (!matchedClaimKeysArray.includes(term)) {
                    matchedClaimKeysArray.push(term);
                  }
                }
              }
            }
          };

          // Start traversing from the document element
          traverseNodes(xmlDoc.documentElement.childNodes);

          if (
            matchedKeysArray.length === 0 &&
            matchedClaimKeysArray.length === 0
          ) {
            alert(
              "No predefined words or claim-specific terms found in the document"
            );
            return;
          }

          // Update state variables with the results
          setWordCounts(counts);
          setMatchedKeys(matchedKeysArray);
          setClaimTermCounts(claimCounts); // Update claim-specific term counts
          setMatchedWords(
            matchedKeysArray.reduce((acc, key) => {
              acc[key] = predefinedWords[key];
              return acc;
            }, {})
          );
          setConfirmationNeeded(false); // Reset confirmation flag
          setUpdatedFile(null); // Reset updated file

          // Now, prompt the user to select replacements for predefined words
          setReplacementSelections(
            matchedKeysArray.reduce((acc, key) => {
              acc[key] = predefinedWords[key][0]; // Default to the first option
              return acc;
            }, {})
          );

          setShowReplacementSelector(true); // Flag to show the replacement selection UI
        };

        reader.readAsArrayBuffer(file); // Read the file as an array buffer
      } catch (error) {
        console.error("Error performing search:", error);
        setError("Error performing search");
      }
    } else {
      alert("Please upload a .docx file");
    }
  };

  // Handler for when the user selects a replacement for a predefined word
  const handleReplacementChange = (key, selectedReplacement) => {
    setReplacementSelections((prev) => ({
      ...prev,
      [key]: selectedReplacement,
    }));
  };

  // Handler to perform replacements and highlight claim-specific terms
  const handlePerformReplacement = async () => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target.result; // Get the file content as an array buffer
        const uint8Array = new Uint8Array(arrayBuffer); // Convert to Uint8Array

        let zip;
        try {
          zip = new PizZip(uint8Array);
        } catch (zipError) {
          console.error("PizZip Error during Replacement:", zipError);
          setError(
            "Failed to parse the .docx file during replacement. Please ensure it is a valid and uncorrupted file."
          );
          return;
        }

        // Read 'word/document.xml' from the zip
        const documentXml = zip.file("word/document.xml");
        if (!documentXml) {
          setError("Invalid .docx file: Missing word/document.xml");
          return;
        }

        const xmlString = documentXml.asText();

        // Parse the XML content
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");

        const wNamespace =
          "http://schemas.openxmlformats.org/wordprocessingml/2006/main";

        // Initialize variables to keep track of counts and matched words
        // Reuse existing counts or reset as needed

        let isInDetailedDescription = false; // Flag to track if currently in "Detailed Description" section

        // Recursive function to traverse XML nodes and perform replacements and highlights
        const traverseAndReplace = (nodes) => {
          for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            // Check for paragraphs to process
            if (node.nodeName === "w:p") {
              // Determine if this paragraph is a heading for "Detailed Description"
              const isHeading = isParagraphHeading(
                node,
                xmlDoc,
                "Detailed Description"
              );

              if (isHeading) {
                isInDetailedDescription = true; // Entering "Detailed Description" section
                continue; // Skip processing the heading paragraph itself
              }

              // Optionally, determine if we've exited the "Detailed Description" section
              // For simplicity, assume that once we enter, all subsequent paragraphs are part of it
              // unless another heading is encountered. Adjust as needed based on document structure.

              // Process the paragraph to perform replacements and highlights
              processParagraph(node, isInDetailedDescription);
              continue; // Continue to the next node
            }

            // Recursively traverse child nodes
            if (node.childNodes && node.childNodes.length > 0) {
              traverseAndReplace(node.childNodes);
            }
          }
        };

        // Function to determine if a paragraph is a heading with specific text
        const isParagraphHeading = (paragraphNode, xmlDoc, headingText) => {
          const paragraphText = getParagraphText(paragraphNode, xmlDoc)
            .trim()
            .toLowerCase();
          return paragraphText === headingText.toLowerCase();
        };

        // Function to extract the full text content of a paragraph
        const getParagraphText = (paragraphNode, xmlDoc) => {
          let text = "";
          const runs = paragraphNode.getElementsByTagName("w:t");
          for (let i = 0; i < runs.length; i++) {
            text += runs[i].textContent;
          }
          return text;
        };

        // Function to process a paragraph and perform replacements and highlights
        const processParagraph = (paragraphNode, isDetailedDescription) => {
          // Collect all runs and their text content
          let runs = [];
          let concatenatedText = "";
          let runPositions = []; // Array of objects with start and end indices

          const paragraphChildNodes = paragraphNode.childNodes;
          for (let j = 0; j < paragraphChildNodes.length; j++) {
            const child = paragraphChildNodes[j];
            if (child.nodeName === "w:r") {
              let runText = "";
              let xmlSpacePreserve = false;

              for (let k = 0; k < child.childNodes.length; k++) {
                const grandChild = child.childNodes[k];
                if (grandChild.nodeName === "w:t") {
                  // Check if xml:space="preserve" is set
                  if (grandChild.getAttribute("xml:space") === "preserve") {
                    xmlSpacePreserve = true;
                  }
                  runText += grandChild.textContent;
                }
              }

              // Include runs even if they contain only whitespace
              runs.push({
                node: child,
                text: runText,
                xmlSpacePreserve: xmlSpacePreserve,
              });
              const startIndex = concatenatedText.length;
              concatenatedText += runText;
              const endIndex = concatenatedText.length;
              runPositions.push({
                start: startIndex,
                end: endIndex,
                runIndex: runs.length - 1,
              });
            }
          }

          if (runs.length === 0) return; // No runs to process

          // Perform replacements on the concatenated text
          let replacements = []; // Array of objects {start, end, replacement, oldWord, highlightColor, isClaimTerm}

          for (const [oldWord, selectedReplacement] of Object.entries(
            replacementSelections
          )) {
            let regex;
            if (/\W/.test(oldWord)) {
              regex = new RegExp(escapeRegExp(oldWord), "gi");
            } else {
              regex = new RegExp(`\\b${escapeRegExp(oldWord)}\\b`, "gi");
            }

            let match;
            while ((match = regex.exec(concatenatedText)) !== null) {
              replacements.push({
                start: match.index,
                end: match.index + match[0].length,
                replacement: selectedReplacement,
                oldWord: oldWord,
                highlightColor: "yellow", // Highlight color for replacements
              });
            }
          }

          // If in "Detailed Description", search for claim-specific terms for red highlighting
          if (isDetailedDescription) {
            for (const term of claimSpecificTerms) {
              let regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
              let match;
              while ((match = regex.exec(concatenatedText)) !== null) {
                replacements.push({
                  start: match.index,
                  end: match.index + match[0].length,
                  replacement: match[0], // No replacement, keep original text
                  oldWord: term,
                  highlightColor: "red", // Highlight color for claim-specific terms
                  isClaimTerm: true, // Flag to indicate claim-specific term
                });
              }
            }
          }

          if (replacements.length === 0) return; // No replacements or highlights needed

          // Sort replacements by start index
          replacements.sort((a, b) => a.start - b.start);

          // Build new runs with replacements and highlights
          let newRuns = [];
          let replacementIndex = 0; // Index in replacements array

          for (let rp = 0; rp < runPositions.length; rp++) {
            const runPos = runPositions[rp];
            const originalRun = runs[runPos.runIndex];
            const originalRunProperties =
              originalRun.node.getElementsByTagName("w:rPr")[0];

            let runStart = runPos.start;
            let runEnd = runPos.end;

            let runCurrentPos = runStart;

            while (runCurrentPos < runEnd) {
              if (
                replacementIndex < replacements.length &&
                replacements[replacementIndex].start < runEnd &&
                replacements[replacementIndex].end > runCurrentPos
              ) {
                const rep = replacements[replacementIndex];

                // Text before the replacement
                if (runCurrentPos < rep.start) {
                  const textBefore = concatenatedText.substring(
                    runCurrentPos,
                    rep.start
                  );
                  const runNode = createRunNode(
                    xmlDoc,
                    wNamespace,
                    textBefore,
                    originalRunProperties,
                    originalRun.xmlSpacePreserve,
                    false
                  );
                  newRuns.push(runNode);
                }

                // Replacement text with appropriate highlighting
                const replacementText = rep.replacement;
                const highlight = rep.isClaimTerm
                  ? true
                  : rep.replacement !== rep.oldWord;
                const highlightColor = rep.isClaimTerm ? "red" : "yellow";

                const runNode = createRunNode(
                  xmlDoc,
                  wNamespace,
                  replacementText,
                  originalRunProperties,
                  originalRun.xmlSpacePreserve,
                  highlight,
                  highlightColor
                );
                newRuns.push(runNode);

                runCurrentPos = rep.end;
                replacementIndex++;
              } else {
                // No replacement in this segment
                const text = concatenatedText.substring(runCurrentPos, runEnd);
                const runNode = createRunNode(
                  xmlDoc,
                  wNamespace,
                  text,
                  originalRunProperties,
                  originalRun.xmlSpacePreserve,
                  false
                );
                newRuns.push(runNode);
                runCurrentPos = runEnd;
              }
            }
          }

          // Remove all original runs
          for (let r = 0; r < runs.length; r++) {
            paragraphNode.removeChild(runs[r].node);
          }

          // Append new runs
          for (let nr = 0; nr < newRuns.length; nr++) {
            paragraphNode.appendChild(newRuns[nr]);
          }
        };

        // Helper function to create a run node with customizable highlight color
        const createRunNode = (
          xmlDoc,
          wNamespace,
          textContent,
          originalRunProperties,
          xmlSpacePreserve,
          highlight = false,
          highlightColor = "yellow" // Default highlight color
        ) => {
          const runNode = xmlDoc.createElementNS(wNamespace, "w:r");

          // Clone original run properties
          if (originalRunProperties) {
            const rPrNode = originalRunProperties.cloneNode(true);

            if (highlight) {
              // Add highlight
              let highlightExists = false;
              for (let child of rPrNode.childNodes) {
                if (child.nodeName === "w:highlight") {
                  highlightExists = true;
                  break;
                }
              }
              if (!highlightExists) {
                const highlightNode = xmlDoc.createElementNS(
                  wNamespace,
                  "w:highlight"
                );
                highlightNode.setAttribute("w:val", highlightColor);
                rPrNode.appendChild(highlightNode);
              } else {
                // If highlight exists, update its color
                for (let child of rPrNode.childNodes) {
                  if (child.nodeName === "w:highlight") {
                    child.setAttribute("w:val", highlightColor);
                    break;
                  }
                }
              }
            }

            runNode.appendChild(rPrNode);
          } else if (highlight) {
            // Create run properties if they don't exist and add highlight
            const rPrNode = xmlDoc.createElementNS(wNamespace, "w:rPr");
            const highlightNode = xmlDoc.createElementNS(
              wNamespace,
              "w:highlight"
            );
            highlightNode.setAttribute("w:val", highlightColor);
            rPrNode.appendChild(highlightNode);
            runNode.appendChild(rPrNode);
          }

          // Create text node
          const tNode = xmlDoc.createElementNS(wNamespace, "w:t");

          // Set xml:space="preserve" if needed
          if (xmlSpacePreserve || /^\s|\s$/.test(textContent)) {
            tNode.setAttributeNS(
              "http://www.w3.org/XML/1998/namespace",
              "xml:space",
              "preserve"
            );
          }

          tNode.textContent = textContent;
          runNode.appendChild(tNode);

          return runNode;
        };

        // Start traversing from the document element
        traverseAndReplace(xmlDoc.documentElement.childNodes);

        // Serialize the modified XML back to a string
        const serializer = new XMLSerializer();
        const modifiedXmlString = serializer.serializeToString(xmlDoc);

        // Replace 'word/document.xml' in the zip with the modified XML
        zip.file("word/document.xml", modifiedXmlString);

        // Generate the new file as a Blob
        const newFile = zip.generate({ type: "blob" });

        // Update state variables with the results
        setUpdatedFile(newFile);
        setConfirmationNeeded(true); // Show confirmation before download
        setShowReplacementSelector(false); // Hide replacement selection UI
      };

      reader.readAsArrayBuffer(file); // Read the file as an array buffer
    } catch (error) {
      console.error("Error performing replacements:", error);
      setError("Error performing replacements");
    }
  };

  // Handler for the "Confirm and Download" button click
  const handleConfirmDownload = async () => {
    try {
      if (updatedFile) {
        // Download the updated file with replacements and highlights
        saveAs(updatedFile, `${fileName} edited.docx`);
        setConfirmationNeeded(false); // Reset confirmation flag after download
      }
    } catch (error) {
      console.error("Error confirming download:", error);
      setError("Error confirming download");
    }
  };

  // Function to download matched words and their replacements as a .txt file
  const downloadMatchedWordsAsTxt = () => {
    // Define column widths for formatting
    const colWidth1 = 25; // Width for predefined words
    const colWidth2 = 40; // Width for alternative words
    const colWidth3 = 10; // Width for count

    // Create table header with borders
    const header = `Predefined Words${" ".repeat(
      colWidth1 - "Predefined Words".length
    )}| Alternative Words${" ".repeat(
      colWidth2 - "Alternative Words".length
    )}| Count`;
    const border = `${"-".repeat(colWidth1)}+${"-".repeat(
      colWidth2
    )}+${"-".repeat(colWidth3)}`;

    // Initialize rows array to store each row of data
    let rows = [];

    // Loop through matched predefined words and their counts
    for (const [word, count] of Object.entries(wordCounts)) {
      const wordCol = word.padEnd(colWidth1, " ");
      const altCol = predefinedWords[word].join(", ").padEnd(colWidth2, " ");
      const countCol = count.toString().padEnd(colWidth3, " ");
      rows.push(`${wordCol}| ${altCol}| ${countCol}`);
    }

    // Combine header, border, and rows into a single string
    const fileContent = [header, border, ...rows].join("\n");

    // Create a Blob and trigger the download
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "MatchedPredefinedWords.txt");
  };

  // Styles for the table display
  const tableStyle = {
    borderCollapse: "collapse",
    width: "100%",
    marginTop: "20px",
  };

  const thTdStyle = {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
  };

  const handleAnalysis = () => {
    console.log("inside handle ansalysis");
    setShowAnalysis((prevValue) => !prevValue);
    setShowDrop(showAnalysis ? "" : setShowDrop(false));
    setShowResult(showAnalysis ? "" : setShowResult(false));
    setShowFileContent(showAnalysis ? "" : setShowFileContent(false));
    setShowClaimContent(showAnalysis ? "" : setShowClaimContent(false));
  };

  const handleProfanity = () => {
    console.log("inside handleProfanity");
    setShowProfanity((prevValue) => !prevValue);
    setShowReplacementSelector(
      showProfanity ? "" : setShowReplacementSelector(false)
    );
    // setConfirmationNeeded(showProfanity ? setConfirmationNeeded(false):'')
    setConfirmationNeeded(showProfanity ? "" : setConfirmationNeeded(false));
    // setShowReplacementSelector(showProfanity ? setShowReplacementSelector(false):'')
    // setShowReplacementSelector(showProfanity ? '' : setShowReplacementSelector(false))
  };

  const handleIndependentClaimList = () => {
    setShowIndependentClaim((prevValue) => !prevValue);
  };

  const handleDependentClaimList = () => {
    setShowDependentClaim((prevValue) => !prevValue);
  };

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
        <button className="manFually button" style={{marginTop}} onClick={() => navigate("/Mannual")}>Enter manually</button>
      </div> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          background: "gba(255, 255, 255, 0.1)",
        }}
      >
        <input type="file" accept=".docx" onChange={handleFileChange} />
        {/* <FileUpload handleFileChange={handleFileChange} /> */}
        <div>
          <button
            className="manually button"
            style={{}}
            onClick={() => navigate("/Mannual")}
          >
            Enter manually
          </button>
        </div>
      </div>
      {fileFound && (
        <>
          <button onClick={handleAnalysis}>
            {showAnalysis
              ? "Close Document Analysis"
              : "View Document Analysis"}
          </button>
          <button
            style={{
              margin: "5%",
              padding: "12px 20px",
              background: isHovered
                ? "linear-gradient(135deg,rgb(204, 151, 167), #6a4caf)"
                : "linear-gradient(135deg, #6a4caf, #c35b7a)",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              borderRadius: "10px",
              letterSpacing: "1.5px",
              transition: "all 0.3s ease-in-out",
              cursor: "pointer",
              position: "relative",
              boxShadow: isHovered
                ? "0 0 10px rgba(255, 255, 255, 0.5)"
                : "2px 2px 10px rgba(0, 0, 0, 0.2)",
              transform: isHovered ? "translateY(-2px)" : "none",
              display: "flex",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleProfanity}
          >
            {showProfanity
              ? "Close Profanity Word Replacer"
              : "Profanity Word Replacer"}
          </button>
        </>
      )}
      {errorMessage && <p className="error">{errorMessage}</p>}
      {fileFound ? (
        ""
      ) : (
        <h5 style={{ color: "black" }}>Attach a word file to scan </h5>
      )}
      {!errorMessage && fileFound && showAnalysis && (
        <>
          <div className="result" style={{ marginBottom: "4%" }}>
            <p>
              Title : <strong>{modifiedTitle}</strong>
            </p>
            <p>
              {" "}
              Word Count : <strong>{wordCount}</strong>
            </p>
            <p>
              Character Count : <strong>{titleChar}</strong>
            </p>
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
        </>
      )}
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
      {showResult && showAnalysis && (
        <div className="result">
          <h3 className="section-title">
            Below is the section-wise total word count
          </h3>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Word Count</th>
              </tr>
            </thead>
            <tbody>
              {/\d/.test(fieldWord) && (
                <tr>
                  <td>Technical Field</td>
                  <td>{fieldWord}</td>
                </tr>
              )}
              {/\d/.test(backgroundWord) && (
                <tr>
                  <td>Background</td>
                  <td>{backgroundWord}</td>
                </tr>
              )}
              {/\d/.test(summaryWord) && (
                <tr>
                  <td>Summary</td>
                  <td>{summaryWord}</td>
                </tr>
              )}
              {/\d/.test(drofDraWord) && (
                <tr>
                  <td>Description of Drawing</td>
                  <td>{drofDraWord}</td>
                </tr>
              )}
              <tr>
                <td>Total Number of Figures</td>
                <td>{imgCount}</td>
              </tr>
              {/\d/.test(detaDesWord) && (
                <tr>
                  <td>Detailed Description</td>
                  <td>{detaDesWord}</td>
                </tr>
              )}
              {/\d/.test(claimedWord) && (
                <tr>
                  <td>Claims</td>
                  <td>{claimedWord}</td>
                </tr>
              )}
              {/\d/.test(abstractWord) && (
                <tr
                  className="tooltip-container"
                  onMouseEnter={() => setIsAbstractHovered(true)}
                  onMouseLeave={() => setIsAbstractHovered(false)}
                >
                  <td>Abstract</td>
                  <td className={isAbstractExceeding ? "exceeding" : "normal"}>
                    {abstractWord}
                    {isAbstractExceeding && (
                      <span
                        className={`tooltip ${
                          isAbstractHovered ? "visible" : ""
                        }`}
                      >
                        Maximum 150 words
                      </span>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <button className="summary-button" onClick={handleSummary}>
            {showSummary ? "Close the Summary" : "View Summary"}
          </button>

          {showSummary && (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Total lines</td>
                  <td>{lineCount}</td>
                </tr>
                <tr>
                  <td>Total word count</td>
                  <td>{fileContent.split(/\s+/).filter(Boolean).length}</td>
                </tr>
                <tr>
                  <td>Total character count</td>
                  <td>{fileContent.replace(/\s/g, "").length}</td>
                </tr>
                <tr>
                  <td>Total sentence count</td>
                  <td>{sentenceCount}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}

      {showDrop && showAnalysis && (
        <div>
          <div>
            <details
              className="custom-dropdown"
              style={{ marginBottom: "4%", width: "100%" }}
            >
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
                        <span style={{ marginLeft: "10px" }}>
                          {section.sName}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          </div>
          <div className="result">
            <div
              style={{
                textDecorationColor: "#0a0909",
                marginBottom: "2%",
                fontWeight: "bold",
              }}
            >
              Word Count of Selected Sections :
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

      {fileFound && !errorMessage && showAnalysis && (
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
                {showFileContent ? "hide" : "view"} Content
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

      {showFileContent && showAnalysis && (
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
              paddingLeft: "20px",
              paddingRight: "20px",
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

      {showClaimContent && showAnalysis && (
        <div className="claim-content">
          <h2>Claims : </h2>
          <p>
            Total Claims : <strong>{total}</strong>
          </p>
          <p>
            Independent Claims : <strong>{independent}</strong>
          </p>
          <p>
            Dependent Claims : <strong>{dependent}</strong>
          </p>
          <p>
            <button onClick={handleIndependentClaimList}>
              {showIndependentClaim
                ? "Close Independent Claim List Count"
                : "Show Independent Claim List Count"}
            </button>
          </p>
          {showIndependentClaim && (
            <pre style={{ color: "white", backgroundColor: "GrayText" }}>
              {independentClaimLists}
            </pre>
          )}
          <p>
            <button onClick={handleDependentClaimList}>
              {showDependentClaim
                ? "Close Dependent Claim List Count"
                : "Show Dependent Claim List Count"}
            </button>
          </p>
          {showDependentClaim && (
            <pre style={{ color: "white", backgroundColor: "GrayText" }}>
              {dependentClaimLists}
            </pre>
          )}
        </div>
      )}
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        {/* <h1 style={{backgroundColor:'blue', color:"white", marginLeft:"250px", marginRight:"870px", justifyContent:"-moz-initial"}}>Profanity Word Replacer</h1> */}

        {/* File input for uploading .docx files */}
        {/* <FileUpload handleFileChange={handleFileChange} error={error} /> */}

        {/* Buttons for processing and downloading */}
        {fileFound && showProfanity && (
          <div style={{ marginBottom: "20px" }}>
            <button
              style={{
                margin: "5%",
                padding: "12px 20px",
                background: isHovered
                  ? "linear-gradient(135deg,rgb(204, 151, 167), #6a4caf)"
                  : "linear-gradient(135deg, #6a4caf, #c35b7a)",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: "10px",
                letterSpacing: "1.5px",
                transition: "all 0.3s ease-in-out",
                cursor: "pointer",
                position: "relative",
                boxShadow: isHovered
                  ? "0 0 10px rgba(255, 255, 255, 0.5)"
                  : "2px 2px 10px rgba(0, 0, 0, 0.2)",
                transform: isHovered ? "translateY(-2px)" : "none",
                display: "flex",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleSearchReplace}
            >
              Search and Replace Profanity Words
            </button>
            {/* <button
          onClick={downloadMatchedWordsAsTxt}
          disabled={Object.keys(wordCounts).length === 0 && Object.keys(claimTermCounts).length === 0}
          style={{ marginLeft: '420px' }}
        >
          Download Matched Words as .txt
        </button> */}
          </div>
        )}

        {/* Replacement Selection UI */}
        {showReplacementSelector && (
          <WordReplacementSelector
            matchedKeys={matchedKeys}
            replacementSelections={replacementSelections}
            predefinedWords={predefinedWords}
            handleReplacementChange={handleReplacementChange}
            handlePerformReplacement={handlePerformReplacement}
          />
        )}

        {/* Display word counts and claim-specific term counts */}
        {(Object.keys(wordCounts).length > 0 ||
          Object.keys(claimTermCounts).length > 0) &&
          !confirmationNeeded &&
          !showReplacementSelector &&
          showProfanity && (
            <WordCountsTable
              wordCounts={wordCounts}
              predefinedWords={predefinedWords}
              claimTermCounts={claimTermCounts}
              confirmationNeeded={confirmationNeeded}
              showReplacementSelector={showReplacementSelector}
            />
          )}

        {/* Confirmation prompt before downloading the updated file */}
        {confirmationNeeded && (
          <Confirmation
            wordCounts={wordCounts}
            replacementSelections={replacementSelections}
            handleConfirmDownload={handleConfirmDownload}
            showProfanity={showProfanity}
            confirmationNeeded={confirmationNeeded}
          />
        )}

        {/* Display any error messages */}
        {error && (
          <div style={{ marginTop: "20px", color: "red" }}>
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Analysis;
