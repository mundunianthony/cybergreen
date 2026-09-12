# Poster assets

The three CyberGreen posters referenced by `/resources` belong in this folder.
They already exist as designed image files - they were not committed here
because they were supplied as chat attachments rather than repository files.

Drop them in with exactly these filenames, and the Resources page will pick
them up with no code change:

| Filename                       | Poster                                                          |
| ------------------------------ | --------------------------------------------------------------- |
| `responsible-tech-guide.jpg`   | Responsible Tech: Securing Our Future, Greening Our Planet        |
| `digital-safety-guide.jpg`     | Responsible Tech & Digital Safety: Building a Safer Digital Uganda |
| `ewaste-hazards.jpg`           | E-Waste Hazards & Call to Action                                  |

Filenames are declared once in `src/data/content.ts` (the `posters` export) -
change them there if the assets arrive under different names.

Until the files are present, each poster renders as a labelled placeholder
card that still carries the title and description, so the page is never
broken - only incomplete.
