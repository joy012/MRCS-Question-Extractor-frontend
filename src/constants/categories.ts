export const DEFAULT_CATEGORIES = [
  {
    name: 'anatomy-thorax',
    displayName: 'Anatomy - Thorax',
    type: 'BASIC' as const,
  },
  {
    name: 'anatomy-abdomen',
    displayName: 'Anatomy - Abdomen',
    type: 'BASIC' as const,
  },
  {
    name: 'anatomy-superior-extremity',
    displayName: 'Anatomy - Superior Extremity',
    type: 'BASIC' as const,
  },
  {
    name: 'anatomy-inferior-extremity',
    displayName: 'Anatomy - Inferior Extremity',
    type: 'BASIC' as const,
  },
  {
    name: 'anatomy-head-neck-brain',
    displayName: 'Anatomy - Head, Neck & Brain',
    type: 'BASIC' as const,
  },
  {
    name: 'physiology',
    displayName: 'Physiology',
    type: 'BASIC' as const,
  },
  {
    name: 'pathology',
    displayName: 'Pathology',
    type: 'BASIC' as const,
  },
  {
    name: 'microbiology',
    displayName: 'Microbiology',
    type: 'BASIC' as const,
  },
  {
    name: 'biostatistics',
    displayName: 'Biostatistics',
    type: 'BASIC' as const,
  },
  {
    name: 'clinical-git-colorectal-abdomen',
    displayName: 'Clinical - GIT, Colorectal & Abdomen',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-hepatobiliary-pancreas',
    displayName: 'Clinical - Hepatobiliary & Pancreas',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-urology',
    displayName: 'Clinical - Urology',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-orthopedics',
    displayName: 'Clinical - Orthopedics',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-breast-endocrine',
    displayName: 'Clinical - Breast & Endocrine',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-ent',
    displayName: 'Clinical - ENT',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-skin',
    displayName: 'Clinical - Skin',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-vascular-surgery',
    displayName: 'Clinical - Vascular Surgery',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-neurosurgery',
    displayName: 'Clinical - Neurosurgery',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-organ-transplantation',
    displayName: 'Clinical - Organ Transplantation',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-pediatric-surgery',
    displayName: 'Clinical - Pediatric Surgery',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-perioperative-care',
    displayName: 'Clinical - Perioperative care',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-post-operative-care',
    displayName: 'Clinical - Post operative care',
    type: 'CLINICAL' as const,
  },
  {
    name: 'clinical-surgical-emergency-trauma',
    displayName: 'Clinical - Surgical Emergency & Trauma',
    type: 'CLINICAL' as const,
  },
] as const;

export type CategoryName = (typeof DEFAULT_CATEGORIES)[number]['name'];
