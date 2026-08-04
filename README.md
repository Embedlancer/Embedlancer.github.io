# EmbedLancer Website

Official company website for EmbedLancer, an embedded product development studio for hardware, firmware, IoT, PCB support, engineering software and production-ready handover packages.

## Pages

- `index.html` - Home page
- `services.html` - Service details
- `projects.html` - CMS-managed project portfolio
- `project.html` - Dynamic project case-study view
- `industries.html` - Industries and application domains
- `case-studies.html` - Detailed project case studies
- `contact.html` - Contact and Book a Call request form
- `process.html` - Development process and delivery outputs
- `enquiry.html` - Compatibility redirect to the Contact page
- `admin/` - Authorized project content management

## Project Content

Portfolio content is maintained in `content/projects.json`. The website uses this source to build the home-page featured work, portfolio index and individual project case studies.

Authorized editors can manage project text and photographs from:

**Admin:** https://embedlancer.github.io/admin/

The admin uses GitHub repository permissions. Access tokens remain in the editor's browser and are never stored in the website source.

## Assets

```text
assets/
  images/
    hardware-validation.jpg
    hero-engineering-lab.jpg
  logos/
    embedlancer-logo-light.png
    embedlancer-black-bg.png
    embedlancer-no-bg.png
    embedlancer-white-bg.png
  projects/
    optimus/
      patient-alert-system-overview.jpeg
      remote-unit.jpeg
      master-unit.jpeg
      master-kit.jpeg
    temperature-controller/
      temperature-controller-device.jpeg
  uploads/
    CMS-managed project photographs
content/
  projects.json
admin/
  index.html
  config.yml
```

## Hosting

**Website:** https://embedlancer.github.io/

The public company website is deployed through GitHub Pages from the root of the `main` branch in `Embedlancer/Embedlancer.github.io`.

## Brand

**Brand:** EmbedLancer  
**Tagline:** Think. Build. Evolve.  
**Contact:** contact.embedlancer@gmail.com

Copyright 2026 EmbedLancer. All rights reserved.
