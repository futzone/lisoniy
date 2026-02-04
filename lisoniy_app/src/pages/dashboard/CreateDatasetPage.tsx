import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Slider } from "@/app/components/ui/slider";
import { Switch } from "@/app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Save,
  Plus,
  Upload,
  Eye,
  Keyboard,
  FileJson,
  Zap,
  Settings,
  Tag,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Globe,
  Lock
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { datasetApi, DatasetResponse } from "@/api/datasetApi";

const datasetTypes = [
  { value: "instruction", label: "Instruction Dataset", description: "Buyruq-javob juftliklari", icon: "💬" },
  { value: "parallel", label: "Parallel Corpus", description: "Parallel matnlar (tarjima)", icon: "🌐" },
  { value: "ner", label: "NER Dataset", description: "Nom-entity recognition", icon: "🏷️" },
  { value: "qa", label: "QA Dataset", description: "Savol-javob juftliklari", icon: "❓" },
  { value: "classification", label: "Classification", description: "Matn klassifikatsiyasi", icon: "📊" },
  { value: "sentiment", label: "Sentiment Analysis", description: "Hissiy tahlil", icon: "😊" },
];

const nerTags = [
  { value: "PERSON", label: "Shaxs", color: "bg-blue-500" },
  { value: "LOC", label: "Joy", color: "bg-green-500" },
  { value: "ORG", label: "Tashkilot", color: "bg-purple-500" },
  { value: "DATE", label: "Sana", color: "bg-orange-500" },
  { value: "MONEY", label: "Pul", color: "bg-yellow-500" },
];

const sentimentOptions = ["positive", "negative", "neutral"];
const classificationLabels = ["sport", "siyosat", "texnologiya", "iqtisod", "madaniyat"];

// License templates (full versions)
const licenseTemplates: Record<string, string> = {
  "MIT": `MIT License

Copyright (c) ${new Date().getFullYear()} [Dataset Creator Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,

  "Apache-2.0": `Apache License
Version 2.0, January 2004
http://www.apache.org/licenses/

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

1. Definitions.
"License" shall mean the terms and conditions for use, reproduction, and
distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the
copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other
entities that control, are controlled by, or are under common control with
that entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising
permissions granted by this License.

"Source" form shall mean the preferred form for making modifications.

"Object" form shall mean any form resulting from mechanical transformation
or translation of a Source form.

"Work" shall mean the work of authorship, whether in Source or Object form,
made available under the License.

"Derivative Works" shall mean any work that is based on the Work.

"Contribution" shall mean any work of authorship submitted to the Licensor
for inclusion in the Work.

"Contributor" shall mean Licensor and any Legal Entity on behalf of whom
a Contribution has been received by Licensor.

2. Grant of Copyright License.
Subject to the terms and conditions of this License, each Contributor hereby
grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
irrevocable copyright license to reproduce, prepare Derivative Works of,
publicly display, publicly perform, sublicense, and distribute the Work.

3. Grant of Patent License.
Subject to the terms and conditions of this License, each Contributor hereby
grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free,
irrevocable patent license to make, have made, use, offer to sell, sell,
import, and otherwise transfer the Work.

4. Redistribution.
You may reproduce and distribute copies of the Work or Derivative Works
thereof in any medium, with or without modifications, and in Source or
Object form, provided that You meet the following conditions:
(a) You must give any other recipients a copy of this License;
(b) You must cause any modified files to carry prominent notices;
(c) You must retain all copyright, patent, trademark notices;
(d) You must include a readable copy of the attribution notices.

5. Submission of Contributions.
Unless You explicitly state otherwise, any Contribution intentionally
submitted for inclusion in the Work by You to the Licensor shall be under
the terms and conditions of this License.

6. Trademarks.
This License does not grant permission to use the trade names, trademarks,
service marks, or product names of the Licensor.

7. Disclaimer of Warranty.
THE WORK IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND.

8. Limitation of Liability.
IN NO EVENT SHALL ANY CONTRIBUTOR BE LIABLE FOR ANY DAMAGES.

9. Accepting Warranty or Additional Liability.
While redistributing the Work, You may choose to offer warranty or
indemnity obligations.`,

  "GPL-3.0": `GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

Copyright (C) 2007 Free Software Foundation, Inc.
Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.

PREAMBLE

The GNU General Public License is a free, copyleft license for software
and other kinds of works.

The licenses for most software and other practical works are designed to
take away your freedom to share and change the works. By contrast, the GNU
General Public License is intended to guarantee your freedom to share and
change all versions of a program--to make sure it remains free software
for all its users.

When we speak of free software, we are referring to freedom, not price. Our
General Public Licenses are designed to make sure that you have the freedom
to distribute copies of free software (and charge for them if you wish),
that you receive source code or can get it if you want it, that you can
change the software or use pieces of it in new free programs, and that you
know you can do these things.

To protect your rights, we need to prevent others from denying you these
rights or asking you to surrender the rights. Therefore, you have certain
responsibilities if you distribute copies of the software, or if you modify
it: responsibilities to respect the freedom of others.

For example, if you distribute copies of such a program, whether gratis or
for a fee, you must pass on to the recipients the same freedoms that you
received. You must make sure that they, too, receive or can get the source
code. And you must show them these terms so they know their rights.

Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and
(2) offer you this License giving you legal permission to copy, distribute
and/or modify it.

For the developers' and authors' protection, the GPL clearly explains that
there is no warranty for this free software. For both users' and authors'
sake, the GPL requires that modified versions be marked as changed, so that
their problems will not be attributed erroneously to authors of previous
versions.

This program is free software: you can redistribute it and/or modify it
under the terms of the GNU General Public License as published by the Free
Software Foundation, either version 3 of the License, or (at your option)
any later version.

This program is distributed in the hope that it will be useful, but WITHOUT
ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
more details.

You should have received a copy of the GNU General Public License along
with this program. If not, see <https://www.gnu.org/licenses/>.`,

  "CC-BY-4.0": `Creative Commons Attribution 4.0 International (CC BY 4.0)

This is a human-readable summary of (and not a substitute for) the license.
https://creativecommons.org/licenses/by/4.0/legalcode

You are free to:

• Share — copy and redistribute the material in any medium or format for
  any purpose, even commercially
• Adapt — remix, transform, and build upon the material for any purpose,
  even commercially

The licensor cannot revoke these freedoms as long as you follow the license
terms.

Under the following terms:

• Attribution — You must give appropriate credit, provide a link to the
  license, and indicate if changes were made. You may do so in any
  reasonable manner, but not in any way that suggests the licensor endorses
  you or your use.

• No additional restrictions — You may not apply legal terms or
  technological measures that legally restrict others from doing anything
  the license permits.

Notices:

You do not have to comply with the license for elements of the material in
the public domain or where your use is permitted by an applicable exception
or limitation.

No warranties are given. The license may not give you all of the permissions
necessary for your intended use. For example, other rights such as
publicity, privacy, or moral rights may limit how you use the material.`,

  "CC-BY-SA-4.0": `Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

This is a human-readable summary of (and not a substitute for) the license.
https://creativecommons.org/licenses/by-sa/4.0/legalcode

You are free to:

• Share — copy and redistribute the material in any medium or format for
  any purpose, even commercially
• Adapt — remix, transform, and build upon the material for any purpose,
  even commercially

The licensor cannot revoke these freedoms as long as you follow the license
terms.

Under the following terms:

• Attribution — You must give appropriate credit, provide a link to the
  license, and indicate if changes were made. You may do so in any
  reasonable manner, but not in any way that suggests the licensor endorses
  you or your use.

• ShareAlike — If you remix, transform, or build upon the material, you
  must distribute your contributions under the same license as the original.

• No additional restrictions — You may not apply legal terms or
  technological measures that legally restrict others from doing anything
  the license permits.

Notices:

You do not have to comply with the license for elements of the material in
the public domain or where your use is permitted by an applicable exception
or limitation.

No warranties are given. The license may not give you all of the permissions
necessary for your intended use. For example, other rights such as
publicity, privacy, or moral rights may limit how you use the material.`,

  "CC0-1.0": `CC0 1.0 Universal (Public Domain Dedication)

STATEMENT OF PURPOSE

The laws of most jurisdictions throughout the world automatically confer
exclusive Copyright and Related Rights (defined below) upon the creator and
subsequent owner(s) (each and all, an "owner") of an original work of
authorship and/or a database (each, a "Work").

Certain owners wish to permanently relinquish those rights to a Work for
the purpose of contributing to a commons of creative, cultural and
scientific works ("Commons") that the public can reliably and without fear
of later claims of infringement build upon, modify, incorporate in other
works, reuse and redistribute as freely as possible in any form whatsoever
and for any purposes, including without limitation commercial purposes.

These owners may contribute to the Commons to promote the ideal of a free
culture and the further production of creative, cultural and scientific
works, or to gain reputation or greater distribution for their Work in
part through the use and efforts of others.

For these and/or other purposes and motivations, and without any
expectation of additional consideration or compensation, the person
associating CC0 with a Work (the "Affirmer"), to the extent that he or she
is an owner of Copyright and Related Rights in the Work, voluntarily
elects to apply CC0 to the Work and publicly distribute the Work under its
terms, with knowledge of his or her Copyright and Related Rights in the
Work and the meaning and intended legal effect of CC0 on those rights.

1. Copyright and Related Rights.
A Work made available under CC0 may be protected by copyright and related
or neighboring rights ("Copyright and Related Rights").

2. Waiver.
To the greatest extent permitted by applicable law, Affirmer hereby
overtly, fully, permanently, irrevocably and unconditionally waives,
abandons, and surrenders all of Affirmer's Copyright and Related Rights.

3. Public License Fallback.
Should any part of the Waiver be judged legally invalid or ineffective,
the Waiver shall be preserved to the maximum extent permitted. In addition,
to the extent the Waiver is so judged, Affirmer hereby grants a royalty-
free, transferable, sublicensable, non-exclusive license.

4. Limitations and Disclaimers.
(a) No trademark or patent rights are waived, abandoned, surrendered,
    licensed or otherwise affected by this document.
(b) Affirmer offers the Work "as-is" and makes no representations or
    warranties of any kind concerning the Work.
(c) Affirmer disclaims responsibility for clearing rights of other persons
    that may apply to the Work.
(d) Affirmer understands and acknowledges that Creative Commons is not a
    party to this document and has no duty or obligation with respect to
    this CC0 or use of the Work.`
};


interface EntityTag {
  start: number;
  end: number;
  text: string;
  tag: string;
}

interface EntryMetadata {
  source: string;
  quality_score: number;
  tags: string[];
}

export function CreateDatasetPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Multi-step flow
  const [currentStep, setCurrentStep] = useState(1); // 1: Dataset Info, 2: Add Entries
  const [createdDataset, setCreatedDataset] = useState<DatasetResponse | null>(null);
  const [isCreatingDataset, setIsCreatingDataset] = useState(false);
  const [isSavingEntry, setIsSavingEntry] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  // Dataset metadata
  const [datasetName, setDatasetName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");

  // Dataset Meta (README, License)
  const [readme, setReadme] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licenseText, setLicenseText] = useState("");


  // Instruction type fields
  const [instruction, setInstruction] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  // Parallel corpus fields
  const [sourceLang, setSourceLang] = useState("uz");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  // NER fields
  const [nerText, setNerText] = useState("");
  const [entities, setEntities] = useState<EntityTag[]>([]);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const [selectedTextRange, setSelectedTextRange] = useState<{ start: number; end: number; text: string } | null>(null);

  // Legal Q&A fields
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [answer, setAnswer] = useState("");
  const [jurisdiction, setJurisdiction] = useState("UZ");
  const [articleRef, setArticleRef] = useState("");

  // Classification/Sentiment fields
  const [classText, setClassText] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState("");

  // Entry metadata
  const [showMetadata, setShowMetadata] = useState(false);
  const [metadata, setMetadata] = useState<EntryMetadata>({
    source: "manual",
    quality_score: 1.0,
    tags: []
  });
  const [newTag, setNewTag] = useState("");

  // Turbo mode
  const [turboMode, setTurboMode] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);
  const [showJsonPreview, setShowJsonPreview] = useState(true);

  // Hotkey support for Save & Next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        handleSaveAndNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedType, instruction, output, sourceText, targetText, nerText, entities, question, answer, classText, selectedLabel, selectedSentiment]);

  // Autofocus first field when type changes
  useEffect(() => {
    if (selectedType) {
      setTimeout(() => {
        const firstInput = document.querySelector<HTMLTextAreaElement | HTMLInputElement>('textarea, input[type="text"]');
        firstInput?.focus();
      }, 100);
    }
  }, [selectedType]);

  // Auto-fill license text when license type is selected
  useEffect(() => {
    if (licenseType && licenseType !== "custom" && licenseTemplates[licenseType]) {
      setLicenseText(licenseTemplates[licenseType]);
    }
  }, [licenseType]);


  const clearForm = () => {
    setInstruction("");
    setInput("");
    setOutput("");
    setSourceText("");
    setTargetText("");
    setNerText("");
    setEntities([]);
    setQuestion("");
    setContext("");
    setAnswer("");
    setArticleRef("");
    setClassText("");
    setSelectedLabel("");
    setSelectedSentiment("");

    // Keep metadata settings in turbo mode
    if (!turboMode) {
      setMetadata({
        source: "manual",
        quality_score: 1.0,
        tags: []
      });
    }
  };

  const getCurrentEntry = () => {
    const baseEntry: any = {};

    switch (selectedType) {
      case "instruction":
        baseEntry.instruction = instruction;
        baseEntry.input = input;
        baseEntry.output = output;
        break;
      case "parallel":
        baseEntry.source_lang = sourceLang;
        baseEntry.target_lang = targetLang;
        baseEntry.source_text = sourceText;
        baseEntry.target_text = targetText;
        break;
      case "ner":
        baseEntry.text = nerText;
        baseEntry.entities = entities;
        break;
      case "qa":
        baseEntry.question = question;
        baseEntry.context = context;
        baseEntry.answer = answer;
        baseEntry.jurisdiction = jurisdiction;
        if (articleRef) baseEntry.article_ref = articleRef;
        break;
      case "classification":
        baseEntry.text = classText;
        baseEntry.label = selectedLabel;
        break;
      case "sentiment":
        baseEntry.text = classText;
        baseEntry.sentiment = selectedSentiment;
        break;
      default:
        return {};
    }

    // Add metadata if provided
    if (showMetadata) {
      baseEntry.entry_metadata = metadata;
    }

    return baseEntry;
  };

  const validateEntry = (): boolean => {
    switch (selectedType) {
      case "instruction":
        if (!instruction || !output) {
          toast.error("Instruction va Output maydonlari to'ldirilishi shart!");
          return false;
        }
        break;
      case "parallel":
        if (!sourceText || !targetText) {
          toast.error("Ikkala til maydoni ham to'ldirilishi shart!");
          return false;
        }
        break;
      case "ner":
        if (!nerText) {
          toast.error("Matn maydoni to'ldirilishi shart!");
          return false;
        }
        if (entities.length === 0) {
          toast.error("Kamida bitta entity belgilash kerak!", { icon: "⚠️" });
        }
        break;
      case "qa":
        if (!question || !answer) {
          toast.error("Savol va Javob maydonlari to'ldirilishi shart!");
          return false;
        }
        break;
      case "classification":
        if (!classText || !selectedLabel) {
          toast.error("Matn va Label maydonlari to'ldirilishi shart!");
          return false;
        }
        break;
      case "sentiment":
        if (!classText || !selectedSentiment) {
          toast.error("Matn va Sentiment maydonlari to'ldirilishi shart!");
          return false;
        }
        break;
      default:
        toast.error("Iltimos, dataset turini tanlang!");
        return false;
    }
    return true;
  };

  // Step 1: Create dataset
  const handleCreateDataset = async () => {
    if (!datasetName.trim()) {
      toast.error("Dataset nomi kiritilishi shart!");
      return;
    }
    if (!selectedType) {
      toast.error("Dataset turini tanlang!");
      return;
    }

    try {
      setIsCreatingDataset(true);
      const dataset = await datasetApi.createDataset({
        name: datasetName.trim(),
        type: selectedType,
        description: description.trim() || undefined,
        is_public: isPublic
      });

      // Save Dataset Meta if any meta fields are filled
      if (readme.trim() || licenseType.trim() || licenseText.trim()) {
        try {
          await datasetApi.updateDatasetMeta(dataset.id, {
            readme: readme.trim() || undefined,
            license_type: licenseType.trim() || undefined,
            license_text: licenseText.trim() || undefined
          });
        } catch (metaError) {
          console.warn("Failed to save dataset meta:", metaError);
          // Non-critical error, continue with dataset creation
        }
      }

      setCreatedDataset(dataset);
      setCurrentStep(2);
      toast.success(`"${dataset.name}" dataseti yaratildi!`, {
        description: "Endi yozuvlar qo'shishingiz mumkin"
      });
    } catch (error) {
      console.error("Failed to create dataset:", error);
      toast.error("Dataset yaratishda xatolik yuz berdi");
    } finally {
      setIsCreatingDataset(false);
    }
  };


  // Step 2: Save entry to API
  const handleSaveAndNext = async () => {
    if (!createdDataset) {
      toast.error("Avval dataset yarating!");
      return;
    }

    if (!validateEntry()) {
      return;
    }

    const entry = getCurrentEntry();

    // Check for duplicates (simple hash comparison)
    const entryHash = JSON.stringify(entry);
    const isDuplicate = entries.some(e => JSON.stringify(e) === entryHash);

    if (isDuplicate) {
      toast.error("Bu yozuv allaqachon mavjud!", {
        description: "O'zgartirishlar kiriting yoki boshqa yozuv qo'shing",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    try {
      setIsSavingEntry(true);

      // Save to API
      await datasetApi.createDataEntry({
        dataset_id: createdDataset.id,
        content: entry,
        metadata: showMetadata ? metadata : undefined
      });

      setEntries([...entries, entry]);
      clearForm();

      toast.success("Yozuv saqlandi!", {
        description: turboMode ? "Navbatdagi yozuvni kiriting" : "Yangi yozuv qo'shildi",
        icon: <CheckCircle2 className="h-4 w-4" />
      });

      // Autofocus in turbo mode
      if (turboMode) {
        setTimeout(() => {
          const firstInput = document.querySelector<HTMLTextAreaElement | HTMLInputElement>('textarea, input[type="text"]');
          firstInput?.focus();
        }, 100);
      }
    } catch (error) {
      console.error("Failed to save entry:", error);
      toast.error("Yozuvni saqlashda xatolik yuz berdi");
    } finally {
      setIsSavingEntry(false);
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) return;

    const selectedText = selection.toString();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Calculate offsets
    const preSelectionRange = range.cloneRange();
    const textArea = document.getElementById("ner-text-area");

    if (textArea && textArea.contains(range.startContainer)) {
      preSelectionRange.selectNodeContents(textArea);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      const end = start + selectedText.length;

      setSelectedTextRange({ start, end, text: selectedText });
      setPopupPosition({ x: rect.left, y: rect.top - 10 });
      setShowTagPopup(true);
    }
  };

  const addEntityTag = (tag: string) => {
    if (selectedTextRange) {
      // Check for overlapping entities
      const hasOverlap = entities.some(e =>
        (selectedTextRange.start >= e.start && selectedTextRange.start < e.end) ||
        (selectedTextRange.end > e.start && selectedTextRange.end <= e.end)
      );

      if (hasOverlap) {
        toast.error("Bu matn allaqachon belgilangan!", { icon: "⚠️" });
        setShowTagPopup(false);
        setSelectedTextRange(null);
        return;
      }

      setEntities([...entities, { ...selectedTextRange, tag }]);
      setShowTagPopup(false);
      setSelectedTextRange(null);
      toast.success(`${nerTags.find(t => t.value === tag)?.label} tegi qo'shildi`);
    }
  };

  const removeEntity = (index: number) => {
    setEntities(entities.filter((_, i) => i !== index));
    toast.success("Teg olib tashlandi");
  };

  const addMetadataTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata({
        ...metadata,
        tags: [...metadata.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeMetadataTag = (tag: string) => {
    setMetadata({
      ...metadata,
      tags: metadata.tags.filter(t => t !== tag)
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!createdDataset) {
      toast.error("Avval dataset yarating!");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const newEntries = Array.isArray(json) ? json : [json];

        setIsSavingEntry(true);
        const result = await datasetApi.createBulkDataEntries({
          dataset_id: createdDataset.id,
          entries: newEntries.map(entry => ({
            content: entry,
            metadata: showMetadata ? metadata : undefined
          }))
        });

        setEntries([...entries, ...newEntries]);
        toast.success(`${result.created} ta yozuv yuklandi!`, {
          description: result.skipped > 0 ? `${result.skipped} ta yozuv o'tkazib yuborildi (dublikat)` : undefined
        });
      } catch (error) {
        console.error("Bulk upload error:", error);
        toast.error("Fayl yuklashda xatolik yuz berdi!");
      } finally {
        setIsSavingEntry(false);
      }
    };
    reader.readAsText(file);
  };

  const livePreview = JSON.stringify(getCurrentEntry(), null, 2);

  const getHighlightedText = () => {
    if (!nerText || entities.length === 0) return nerText;

    let result: JSX.Element[] = [];
    let lastIndex = 0;

    // Sort entities by start position
    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

    sortedEntities.forEach((entity, idx) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>{nerText.substring(lastIndex, entity.start)}</span>
        );
      }

      // Add highlighted entity
      const tagInfo = nerTags.find(t => t.value === entity.tag);
      result.push(
        <span
          key={`entity-${idx}`}
          className={`${tagInfo?.color} bg-opacity-30 px-1 rounded`}
          title={entity.tag}
        >
          {entity.text}
        </span>
      );

      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < nerText.length) {
      result.push(
        <span key="text-end">{nerText.substring(lastIndex)}</span>
      );
    }

    return <>{result}</>;
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="shrink-0 px-2 sm:px-4">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Orqaga</span>
              </Button>
              <div className="h-6 border-l border-border hidden sm:block" />
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                </div>
                <span className="font-bold hidden sm:inline">Lisoniy</span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-muted rounded-lg">
                <Zap className="h-3 w-3 text-yellow-500" />
                <span className="text-xs sm:text-sm font-medium hidden xs:inline">Turbo</span>
                <Switch checked={turboMode} onCheckedChange={setTurboMode} />
              </div>
              <Badge variant="secondary" className="gap-1 hidden md:flex">
                <Keyboard className="h-3 w-3" />
                Ctrl + Enter
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8 pb-24 max-w-full overflow-hidden">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3 w-full">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 min-w-0 w-full overflow-hidden">

            {/* Step Indicator */}
            <div className="flex items-center gap-4 mb-6">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  1
                </div>
                <span className="font-medium hidden sm:inline">Dataset yaratish</span>
              </div>
              <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-primary' : 'bg-muted'}`} />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full font-bold ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Yozuvlar qo'shish</span>
              </div>
            </div>

            {/* STEP 1: Dataset Info */}
            {currentStep === 1 && (
              <>
                {/* Title Section */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Yangi Dataset yaratish</h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Avval dataset ma'lumotlarini kiriting
                  </p>
                </div>

                {/* Dataset Name & Description */}
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle>Dataset ma'lumotlari</CardTitle>
                    <CardDescription>Dataset nomi va tavsifini kiriting</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataset-name" className="text-base font-semibold">
                        Dataset nomi <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="dataset-name"
                        placeholder="Masalan: O'zbek tili Parallel Corpus"
                        value={datasetName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDatasetName(e.target.value)}
                        className="text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Tavsif
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Dataset haqida qisqacha ma'lumot..."
                        rows={3}
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        className="text-base"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {isPublic ? (
                          <Globe className="h-5 w-5 text-green-500" />
                        ) : (
                          <Lock className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">
                            {isPublic ? "Ommaviy dataset" : "Shaxsiy dataset"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {isPublic ? "Boshqalar ko'ra oladi" : "Faqat siz ko'rasiz"}
                          </div>
                        </div>
                      </div>
                      <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                    </div>

                    {/* Dataset Meta Section */}
                    <Accordion type="single" collapsible className="mt-4">
                      <AccordionItem value="meta" className="border-2 rounded-lg px-4">
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-2">
                            <FileJson className="h-4 w-4" />
                            <span className="font-semibold">README & Litsenziya (Ixtiyoriy)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="readme" className="text-base font-semibold">
                              README (Markdown)
                            </Label>
                            <Textarea
                              id="readme"
                              placeholder="# Dataset haqida&#10;&#10;Bu dataset..."
                              rows={6}
                              value={readme}
                              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReadme(e.target.value)}
                              className="text-base font-mono text-sm"
                            />
                            <p className="text-xs text-muted-foreground">
                              📝 Markdown formatida yozishingiz mumkin
                            </p>
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="license-type" className="text-base font-semibold">
                                Litsenziya turi
                              </Label>
                              <Select value={licenseType} onValueChange={setLicenseType}>
                                <SelectTrigger id="license-type">
                                  <SelectValue placeholder="Tanlang..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MIT">MIT</SelectItem>
                                  <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                                  <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                                  <SelectItem value="CC-BY-4.0">CC BY 4.0</SelectItem>
                                  <SelectItem value="CC-BY-SA-4.0">CC BY-SA 4.0</SelectItem>
                                  <SelectItem value="CC0-1.0">CC0 (Public Domain)</SelectItem>
                                  <SelectItem value="custom">Boshqa</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {licenseType === "custom" && (
                            <div className="space-y-2">
                              <Label htmlFor="license-text" className="text-base font-semibold">
                                Litsenziya matni
                              </Label>
                              <Textarea
                                id="license-text"
                                placeholder="Litsenziya shartlarini kiriting..."
                                rows={4}
                                value={licenseText}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLicenseText(e.target.value)}
                                className="text-base font-mono text-sm"
                              />
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>


                {/* Dataset Type Selector */}
                <Card className="border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle>Dataset turi <span className="text-red-500">*</span></CardTitle>
                    <CardDescription>Qaysi turdagi ma'lumot kiritmoqchisiz?</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {datasetTypes.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setSelectedType(type.value)}
                          className={`
                            relative p-4 rounded-lg border-2 text-left transition-all hover:shadow-md
                            ${selectedType === type.value
                              ? 'border-primary bg-primary/5 shadow-md'
                              : 'border-border hover:border-primary/50'
                            }
                          `}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <div className="font-semibold mb-1">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                          {selectedType === type.value && (
                            <div className="absolute top-2 right-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Create Dataset Button */}
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={handleCreateDataset}
                  disabled={!datasetName.trim() || !selectedType || isCreatingDataset}
                >
                  {isCreatingDataset ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                  {isCreatingDataset ? "Yaratilmoqda..." : "Dataset yaratish va davom etish"}
                </Button>
              </>
            )}

            {/* STEP 2: Add Entries */}
            {currentStep === 2 && createdDataset && (
              <>
                {/* Title Section */}
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
                    {createdDataset.name}
                    {createdDataset.is_public ? (
                      <Globe className="inline-block h-5 w-5 sm:h-6 sm:w-6 ml-2 text-green-500" />
                    ) : (
                      <Lock className="inline-block h-5 w-5 sm:h-6 sm:w-6 ml-2 text-muted-foreground" />
                    )}
                  </h1>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    {datasetTypes.find(t => t.value === createdDataset.type)?.icon}{' '}
                    {datasetTypes.find(t => t.value === createdDataset.type)?.label} — Yozuvlar qo'shish
                  </p>
                </div>


                {/* Dynamic Form Based on Type */}
                {selectedType && (
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">
                          {datasetTypes.find(t => t.value === selectedType)?.icon}
                        </span>
                        Yozuv ma'lumotlari
                      </CardTitle>
                      <CardDescription>
                        {datasetTypes.find(t => t.value === selectedType)?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Instruction Form */}
                      {selectedType === "instruction" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="instruction" className="text-base font-semibold">
                              Instruction (Ko'rsatma) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="instruction"
                              placeholder="Foydalanuvchining buyrug'i yoki savoli&#10;Masalan: O'zbekiston poytaxti haqida ma'lumot ber"
                              rows={3}
                              value={instruction}
                              onChange={(e) => setInstruction(e.target.value)}
                              className="text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="input" className="text-base font-semibold">
                              Input (Qo'shimcha kontekst)
                            </Label>
                            <Textarea
                              id="input"
                              placeholder="Qo'shimcha ma'lumot yoki kontekst (ixtiyoriy)"
                              rows={2}
                              value={input}
                              onChange={(e) => setInput(e.target.value)}
                              className="text-base"
                            />
                            <p className="text-xs text-muted-foreground">
                              💡 Input maydonidan model uchun qo'shimcha kontekst berish uchun foydalaning
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="output" className="text-base font-semibold">
                              Output (Ideal javob) <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="output"
                              placeholder="Kutilayotgan javob yoki natija&#10;Masalan: O'zbekiston poytaxti - Toshkent shahri..."
                              rows={5}
                              value={output}
                              onChange={(e) => setOutput(e.target.value)}
                              className="border-2 border-primary/30 text-base"
                            />
                          </div>
                        </div>
                      )}

                      {/* Parallel Corpus Form */}
                      {selectedType === "parallel" && (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="source-lang">Manba tili</Label>
                              <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger id="source-lang">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="uz">🇺🇿 O'zbek</SelectItem>
                                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                                  <SelectItem value="en">🇬🇧 English</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="target-lang">Nishon tili</Label>
                              <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger id="target-lang">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">🇬🇧 English</SelectItem>
                                  <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                                  <SelectItem value="uz">🇺🇿 O'zbek</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="source" className="text-base font-semibold">
                                Manba matni <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="source"
                                placeholder="O'zbek tilidagi matn"
                                rows={8}
                                value={sourceText}
                                onChange={(e) => setSourceText(e.target.value)}
                                className="border-2 border-blue-500/30 text-base font-medium"
                              />
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                                {sourceText.length} belgi
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="target" className="text-base font-semibold">
                                Nishon matni <span className="text-red-500">*</span>
                              </Label>
                              <Textarea
                                id="target"
                                placeholder="Ingliz tilidagi matn"
                                rows={8}
                                value={targetText}
                                onChange={(e) => setTargetText(e.target.value)}
                                className="border-2 border-green-500/30 text-base font-medium"
                              />
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                                {targetText.length} belgi
                              </div>
                            </div>
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-sm">
                            💡 <strong>Maslahat:</strong> Ikkala matn ham bir xil ma'noni anglatishi kerak
                          </div>
                        </div>
                      )}

                      {/* NER Annotator Form */}
                      {selectedType === "ner" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="ner-text" className="text-base font-semibold">
                              Matn <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="ner-text-area"
                              placeholder="Matnni kiriting va kerakli so'zlarni sichqoncha bilan belgilang..."
                              rows={6}
                              value={nerText}
                              onChange={(e) => setNerText(e.target.value)}
                              onMouseUp={handleTextSelection}
                              className="border-2 font-medium text-base"
                            />
                            <p className="text-xs text-muted-foreground">
                              🏷️ So'zni belgilang va paydo bo'ladigan menyudan teg tanlang
                            </p>
                          </div>

                          {/* Tag Popup */}
                          {showTagPopup && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowTagPopup(false)}
                              />
                              <div
                                className="fixed z-50 bg-card border-2 border-primary rounded-lg shadow-2xl p-2 min-w-[180px]"
                                style={{
                                  left: `${popupPosition.x}px`,
                                  top: `${popupPosition.y}px`,
                                  transform: 'translate(-50%, -100%)'
                                }}
                              >
                                <div className="text-xs font-semibold mb-2 px-2 text-muted-foreground">
                                  Teg tanlang:
                                </div>
                                {nerTags.map((tag) => (
                                  <Button
                                    key={tag.value}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start text-sm gap-2 hover:bg-primary/10"
                                    onClick={() => addEntityTag(tag.value)}
                                  >
                                    <span className={`w-3 h-3 rounded ${tag.color}`} />
                                    {tag.label}
                                  </Button>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Entity Preview */}
                          {nerText && (
                            <div className="space-y-2">
                              <Label className="text-base font-semibold">Ko'rinish</Label>
                              <div className="p-4 rounded-lg border-2 bg-muted/50 text-base leading-relaxed">
                                {getHighlightedText()}
                              </div>
                            </div>
                          )}

                          {/* Entity List */}
                          {entities.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-base font-semibold">
                                Belgilangan teglar ({entities.length})
                              </Label>
                              <div className="flex flex-wrap gap-2">
                                {entities.map((entity, idx) => {
                                  const tagInfo = nerTags.find(t => t.value === entity.tag);
                                  return (
                                    <Badge
                                      key={idx}
                                      className={`${tagInfo?.color} bg-opacity-20 gap-2 pr-1 text-base`}
                                    >
                                      <span className="font-semibold">{entity.text}</span>
                                      <span className="text-xs opacity-75">({tagInfo?.label})</span>
                                      <button
                                        onClick={() => removeEntity(idx)}
                                        className="ml-1 hover:bg-black/10 rounded p-0.5"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg text-sm">
                            ⚠️ Kamida bitta entity belgilashingiz kerak
                          </div>
                        </div>
                      )}


                      {/* QA Form */}
                      {selectedType === "qa" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="question" className="text-base font-semibold">
                              Savol <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="question"
                              placeholder="Savol matni"
                              value={question}
                              onChange={(e) => setQuestion(e.target.value)}
                              className="text-base"
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="jurisdiction" className="text-base font-semibold">
                                Yurisdiktsiya
                              </Label>
                              <Input
                                id="jurisdiction"
                                placeholder="UZ"
                                value={jurisdiction}
                                onChange={(e) => setJurisdiction(e.target.value)}
                                className="text-base"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="article-ref" className="text-base font-semibold">
                                Qo'shimcha havola
                              </Label>
                              <Input
                                id="article-ref"
                                placeholder="..."
                                value={articleRef}
                                onChange={(e) => setArticleRef(e.target.value)}
                                className="text-base"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="context" className="text-base font-semibold">
                              Kontekst (Manba)
                            </Label>
                            <Textarea
                              id="context"
                              placeholder="Tegishli ma'lumotlar yoki kontekst"
                              rows={4}
                              value={context}
                              onChange={(e) => setContext(e.target.value)}
                              className="text-base font-mono text-sm"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="answer" className="text-base font-semibold">
                              Javob <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="answer"
                              placeholder="Savolga batafsil javob"
                              rows={5}
                              value={answer}
                              onChange={(e) => setAnswer(e.target.value)}
                              className="border-2 border-primary/30 text-base"
                            />
                          </div>

                          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-sm">
                            💡 <strong>Maslahat:</strong> Savolga mos manba yoki kontekst qo'shing
                          </div>
                        </div>
                      )}

                      {/* Classification Form */}
                      {selectedType === "classification" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="class-text" className="text-base font-semibold">
                              Matn <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="class-text"
                              placeholder="Klassifikatsiya qilinadigan matn"
                              rows={4}
                              value={classText}
                              onChange={(e) => setClassText(e.target.value)}
                              className="text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base font-semibold">
                              Label <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {classificationLabels.map((label) => (
                                <button
                                  key={label}
                                  onClick={() => setSelectedLabel(label)}
                                  className={`
                                px-4 py-2 rounded-lg border-2 transition-all font-medium capitalize
                                ${selectedLabel === label
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-border hover:border-primary/50'
                                    }
                              `}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sentiment Form */}
                      {selectedType === "sentiment" && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="sentiment-text" className="text-base font-semibold">
                              Matn <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                              id="sentiment-text"
                              placeholder="Hissiyot tahlil qilinadigan matn"
                              rows={4}
                              value={classText}
                              onChange={(e) => setClassText(e.target.value)}
                              className="text-base"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-base font-semibold">
                              Hissiyot <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-3">
                              {sentimentOptions.map((sentiment) => (
                                <button
                                  key={sentiment}
                                  onClick={() => setSelectedSentiment(sentiment)}
                                  className={`
                                flex-1 px-4 py-3 rounded-lg border-2 transition-all font-medium capitalize
                                ${selectedSentiment === sentiment
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-border hover:border-primary/50'
                                    }
                              `}
                                >
                                  {sentiment === 'positive' && '😊 Ijobiy'}
                                  {sentiment === 'negative' && '😞 Salbiy'}
                                  {sentiment === 'neutral' && '😐 Neytral'}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Metadata Section */}
                      <Accordion type="single" collapsible>
                        <AccordionItem value="metadata" className="border-2 rounded-lg px-4">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              <span className="font-semibold">Metadata (Ixtiyoriy)</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="space-y-4 pt-4">
                            <div className="space-y-2">
                              <Label htmlFor="source">Manba</Label>
                              <Select
                                value={metadata.source}
                                onValueChange={(value) => setMetadata({ ...metadata, source: value })}
                              >
                                <SelectTrigger id="source">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="manual">Qo'lda kiritilgan</SelectItem>
                                  <SelectItem value="web_crawl">Web crawl</SelectItem>
                                  <SelectItem value="api">API</SelectItem>
                                  <SelectItem value="dataset">Boshqa dataset</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="quality">Sifat bahosi: {metadata.quality_score.toFixed(1)}</Label>
                              <Slider
                                id="quality"
                                min={0}
                                max={1}
                                step={0.1}
                                value={[metadata.quality_score]}
                                onValueChange={(value) => setMetadata({ ...metadata, quality_score: value[0] })}
                                className="py-4"
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Past</span>
                                <span>Yuqori</span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="tags">Teglar</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="tags"
                                  placeholder="Teg qo'shish"
                                  value={newTag}
                                  onChange={(e) => setNewTag(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMetadataTag())}
                                />
                                <Button type="button" size="sm" onClick={addMetadataTag}>
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              {metadata.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {metadata.tags.map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1">
                                      {tag}
                                      <button onClick={() => removeMetadataTag(tag)}>
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t-2">
                        <Button
                          onClick={handleSaveAndNext}
                          className="flex-1 gap-2 h-12 text-base font-semibold"
                          size="lg"
                        >
                          <Save className="h-5 w-5" />
                          {turboMode ? "Saqlash va Keyingisi" : "Saqlash"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearForm}
                          size="lg"
                          className="h-12"
                        >
                          Tozalash
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Bulk Upload */}
                <Card className="border-2 border-dashed">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Ommaviy yuklash
                    </CardTitle>
                    <CardDescription>JSON faylini yuklang (bir nechta yozuvni bir vaqtning o'zida)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 hover:border-primary/50 transition-all"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Faylni tanlash yoki sudrab oling</span>
                      <span className="text-xs text-muted-foreground mt-1">.json formatda</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column - Preview & Stats (hidden on mobile/tablet) */}
          <div className="hidden lg:block space-y-6">
            <Card className="border-2 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardHeader>
                <CardTitle className="text-lg">Statistika</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saqlangan yozuvlar</span>
                  <Badge variant="default" className="text-2xl px-4 py-2 font-bold">
                    {entries.length}
                  </Badge>
                </div>

                {entries.length > 0 && (
                  <div className="pt-4 border-t space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Jami ma'lumot:</span>
                      <span className="font-semibold">
                        {(JSON.stringify(entries).length / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Live JSON Preview */}
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileJson className="h-4 w-4" />
                    JSON Preview
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowJsonPreview(!showJsonPreview)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                <CardDescription>Joriy yozuvning JSON ko'rinishi</CardDescription>
              </CardHeader>
              {showJsonPreview && (
                <CardContent>
                  <div className="rounded-lg bg-muted p-4 font-mono text-xs overflow-x-auto max-h-96 overflow-y-auto">
                    <pre>{livePreview}</pre>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Help Card */}
            <Card className="border-2 bg-blue-50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-lg">Maslahatlar</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 text-muted-foreground">
                <div className="flex items-start gap-2">
                  <Keyboard className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p><kbd className="px-2 py-1 bg-muted rounded font-mono text-xs">Ctrl+Enter</kbd> - Tezkor saqlash</p>
                </div>
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
                  <p>Turbo Mode yoqilganda metadata saqlanib qoladi</p>
                </div>
                <div className="flex items-start gap-2">
                  <Tag className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>NER uchun so'zni belgilang va tegni tanlang</p>
                </div>
                <div className="flex items-start gap-2">
                  <Upload className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>JSON faylini yuklash orqali ko'p ma'lumot qo'shing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}