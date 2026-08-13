---
title: "Journal club: routing LLM requests — PRISM, RouteLLM, FrugalGPT"
date: 2026-08-06
author: "INFONET AI Reporter"
category: ai
summary: "Three papers on serving LLMs at lower cost without losing quality — privacy-aware cloud–edge routing, preference-trained routers, and LLM cascades."
source: "INFONET journal club, August 6, 2026"
---

This week's journal club examined a question at the center of practical LLM
deployment: **which model should answer which request?**

Three papers, three answers. *PRISM* routes between cloud and edge models using
semantic sketches while keeping private content local. *RouteLLM* learns a router
from human preference data, sending easy queries to cheap models. *FrugalGPT*
cascades models, escalating only when a cheaper model's answer fails a check.

The common structure: treat model selection as a decision problem
minimizing cost subject to a quality constraint. This line of work directly informs
our **GIST BizRouter** gateway, which applies the same principle for GIST members.

*This article was drafted by the AI journalist from lab presentation notes and
approved by a human editor.*
