import React, { useState, useEffect } from "react";
import { AlignmentType, Document, Packer, Paragraph, TabStopType, TextRun } from "docx";
import { saveAs } from "file-saver";
import axios from "axios";
import { useParams } from "react-router-dom";
import config from "../components/conf/config";

const RequestLetter = () => {
    const { id } = useParams()
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
    const [apiData, setApiData] = useState([]);
    const [apiData1, setApiData1] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${config.BASE_URL}/test.php?number=${id}`);
                if (response.data.Status) {
                    setApiData(response.data.user);
                    setApiData1(response.data)
                } else {
                    console.error("API response error", response.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const generateDetailsText = (cdr, caf, address, provider, mobNo, fdate, tdate) => {
        if (cdr === "1" && caf === "1" && address === "1") {
            return `Customer Application Form, Address proof & Decoded Call details of ${provider} Mobile Phone Number ${mobNo} for the period from ${fdate} to ${tdate}.`;
        } else if (cdr === "1" && caf === "1" && address === "0") {
            return `Customer Application Form & Decoded Call details of ${provider} Mobile Phone Number ${mobNo} for the period from ${fdate} to ${tdate}.`;
        } else if (cdr === "1" && caf === "0" && address === "1") {
            return `Address & Decoded Call details of ${provider} Mobile Phone Number ${mobNo} for the period from ${fdate} to ${tdate}.`;
        } else if (cdr === "1" && caf === "0" && address === "0") {
            return `Decoded Call details of ${provider} Mobile Phone Number ${mobNo} for the period from ${fdate} to ${tdate}.`;
        } else if (cdr === "0" && caf === "1" && address === "1") {
            return `Customer Application Form & Address details of ${provider} Mobile Phone Number ${mobNo}.`;
        } else if (cdr === "0" && caf === "1" && address === "0") {
            return `Customer Application Form of ${provider} Mobile Phone Number ${mobNo}.`;
        } else {
            return `No information requested for ${provider} Mobile Phone Number ${mobNo}.`;
        }
    };

    const generateWordDocument = (apiData1, provider, users, address) => {
        const doc = new Document({
            styles: {
                paragraphStyles: [
                    {
                        id: "Normal",
                        name: "Normal",
                        basedOn: "Normal",
                        next: "Normal",
                        quickFormat: true,
                        run: {
                            font: "Cambria",
                            size: 24, // 12pt
                        },
                        paragraph: {
                            spacing: {
                                line: 1.25 * 240, // Line spacing is defined in 1/20th of a point. 1.5 = 360 / 240.
                            },
                        },
                    },

                ],
            },
            sections: [
                {

                    children: [
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "// CONFIDENTIAL //", bold: true, size: 28, })], }),
                        new Paragraph({
                            children: [
                                new TextRun({ text: `No: ${apiData1.CFC_No}/CFC/KC/2024`, bold: true, }),
                                new TextRun({ text: `\tDate: ${formattedDate}`, bold: true, }),
                            ], tabStops: [{ type: TabStopType.LEFT, position: 0, }, { type: TabStopType.RIGHT, position: 9000, },],
                        }),
                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Request under Section 94 BNSS 2023", bold: true, underline: {} })], }),
                        new Paragraph({ children: [new TextRun({ text: "To", bold: true }),], }),
                        new Paragraph({ children: [new TextRun({ text: `\t${address.line1},`, bold: true })], tabStops: [{ type: TabStopType.LEFT, position: 250 }], }),
                        new Paragraph({ children: [new TextRun({ text: `\t${address.line2},`, bold: true })], tabStops: [{ type: TabStopType.LEFT, position: 250 }], }),
                        new Paragraph({ children: [new TextRun({ text: `\t${address.line3}`, bold: true })], tabStops: [{ type: TabStopType.LEFT, position: 250 }], }),
                        new Paragraph({ children: [new TextRun({ text: `\t${address.line4}`, bold: true })], tabStops: [{ type: TabStopType.LEFT, position: 250 }], }),
                        new Paragraph({ children: [new TextRun({ text: "Sir," }),], }),
                        new Paragraph({ children: [new TextRun({ text: "\tSub:  Request for Certified Copy of CAF & Call details - reg." }),], tabStops: [{ type: TabStopType.LEFT, position: 250, },] }),
                        new Paragraph({ children: [new TextRun({ text: "\tRef:  Request from Eloor Police Station" }),], tabStops: [{ type: TabStopType.LEFT, position: 250, },] }),
                        new Paragraph({ children: [new TextRun({ text: `\tKindly refer to the above subject and reference cited. The Certified Copy of following are very essential for submitting before the Hon'ble Court as evidence in connection with ${apiData1.caseStation} Crime - ${apiData1.Crime_No} u/s ${apiData1.Sections} .`, size: 24, }),], tabStops: [{ type: TabStopType.LEFT, position: 250, },] }),

                        ...users.map((item, index) => {
                            const detailsText = generateDetailsText(
                                item.cdr,
                                item.CAF,
                                item.address,
                                item.Provider,
                                item.mobNo,
                                item.fdate,
                                item.tdate
                            );
                            return new Paragraph({
                                children: [new TextRun(`${index + 1}.  ${detailsText}`)],
                            });
                        }),
                        new Paragraph({ children: [new TextRun({ text: "\tYou are requested to furnish the above-mentioned information at the earliest. Kindly treat this matter as urgent." }),], tabStops: [{ type: TabStopType.LEFT, position: 250, },] }),
                        new Paragraph({ children: [new TextRun({ text: "\tYours faithfully,," }),], tabStops: [{ type: TabStopType.LEFT, position: 5550, },] }),
                        new Paragraph(""),
                        new Paragraph(""),
                        new Paragraph({ children: [new TextRun({ text: "\tDeputy Commissioner of Police," }),], tabStops: [{ type: TabStopType.LEFT, position: 5550, },] }),
                        new Paragraph({ children: [new TextRun({ text: "\tPolice Commissionerate, Kochi," }),], tabStops: [{ type: TabStopType.LEFT, position: 5550, },] }),
                        new Paragraph({ children: [new TextRun({ text: "Address: ", bold: true, underline: {}, }),], }),
                        new Paragraph({ children: [new TextRun({ text: "12th Floor, Revenue Tower," }),], }),
                        new Paragraph({ children: [new TextRun({ text: "Park Avenue Road, Ernakulam - 682011" }),], }),
                        new Paragraph({ children: [new TextRun({ text: "Ph: 9497976004" }),], }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, `${provider}_Request_Letter.docx`);
        });
    };

    const generateDocuments = () => {
        const groupedByProvider = apiData.reduce((acc, user) => {
            if (!acc[user.Provider]) acc[user.Provider] = [];
            acc[user.Provider].push(user);
            return acc;
        }, {});

        const providerAddresses = {
            Airtel: {
                line1: "The Nodal Officer",
                line2: "Bharti Airtel Limited",
                line3: "NH Bypass, Maradu",
                line4: "Kundannoor Junction, Kochi – 682304",
            },
            VI: {
                line1: "The Nodal Officer",
                line2: "Vodafone Idea Limited",
                line3: "V.J Tower  Vyttila P.O",
                line4: "Ernakulam-682019",
            },
            Jio: {
                line1: "The State Nodal Officer",
                line2: "Reliance Jio Infocomm Limited",
                line3: "Pukalakkattu Kariyattu Tower, Near Yathri Nivas",
                line4: "Palarivattom P. O, Kochi - 682 025",
            },
            BSNL: {
                line1: "Dr.K Francis Jacob",
                line2: "Nodal Officer LEA & PGM (NWO - CM)",
                line3: "Bharat Sanchar Nigam Limited",
                line4: "First Floor, Telephone Exchange Building Panampilly Nagar, Ernakulam - 682036",
            },
        };

        Object.entries(groupedByProvider).forEach(([provider, users]) => {
            const address = providerAddresses[provider] || {
                line1: "The Nodal Officer,",
                line2: "Unknown Provider,",
                line3: "Location Not Available",
            };
            generateWordDocument(apiData1, provider, users, address);
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <button onClick={generateDocuments} className="btn btn-primary">
                Generate Documents
            </button>
        </div>
    );
};

export default RequestLetter;
