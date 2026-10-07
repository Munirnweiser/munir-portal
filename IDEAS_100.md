# 100 Ideas — NOT on the site (planning file, repo root only)

For tomorrow's working session with Munir. Work through together, build the
chosen ones into the site one by one.

## TRACK 1 — Financial Knowledge (25)

1. Interactive trade-lifecycle diagram (clickable 11 stages)
2. FIX message builder (assemble NewOrderSingle tag-by-tag, live checksum)
3. VaR calculator page (parametric + historical)
4. Order types explorer (market/limit/stop/IOC/FOK with fill animations)
5. Settlement fails & buy-ins simulator
6. Corporate actions tutorial (dividends, splits, mergers, elections)
7. Repo market explainer + repo interest calculator
8. CDS / credit derivatives tutorial
9. Options Greeks interactive lab (vol/rate/time sliders)
10. Futures margin calculator (initial + variation margin)
11. FX swap points calculator
12. Bond accrued interest (dirty/clean) calculator
13. Portfolio attribution mini-tutorial
14. Market microstructure tutorial (order books, matching engines, latency)
15. Reference data tutorial (CUSIP/ISIN/SEDOL, golden copy)
16. Reconciliation breaks game (match break → cause, timed)
17. Regulatory reporting basics (MiFID II / EMIR for support)
18. Collateral & margining tutorial
19. Exotic options overview (barriers, Asians, digitals)
20. Commodities curve deep dive (contango/backwardation, roll yield)
21. Dividend discount model calculator
22. FX option pricing intuition (Garman-Kohlhagen inputs)
23. Interest rate swaps tutorial (fixed vs floating, DV01)
24. Credit spread / Z-spread calculator
25. P&L explain tutorial (attribution: market moves vs trading)

## TRACK 2 — DevOps: Jenkins, Gerrit, Terraform, Ansible, YAML (25)

26. Jenkins hands-on: Jenkinsfile that builds the portal
27. Jenkins shared libraries tutorial
28. Jenkins credentials & secrets debugging lab
29. Jenkins pipeline performance (parallel stages) lab
30. Gerrit workflow tutorial (Change-Id, +2, submit rules)
31. Gerrit hands-on: review flow on a real test repo
32. Gerrit vs GitHub PRs comparison (for interviews)
33. Terraform hands-on: provision a real resource end-to-end
34. Terraform state surgery lab (import, mv, rm, lock recovery)
35. Terraform modules + version pinning tutorial
36. Terraform drift detection lab
37. Ansible hands-on: playbook deploying the portal backend
38. Ansible roles deep dive (structure, variable precedence)
39. Ansible dynamic inventory lab
40. Ansible Vault hands-on
41. YAML mastery drills (anchors, merge keys, gotchas quiz)
42. YAML linting in CI (yamllint + schema validation)
43. Dockerfile optimization challenge (measure layer savings)
44. Docker multi-stage builds lab
45. Kubernetes hands-on: deploy trading API to kind/k3s
46. K8s troubleshooting drills (CrashLoop, OOMKilled, ImagePullBackOff)
47. Helm chart tutorial (chart for the backend)
48. K8s probes deep dive (liveness vs readiness incidents)
49. GitOps overview (ArgoCD)
50. CI/CD for the portal: extend Actions (lint → test → build → deploy)

## TRACK 3 — Site Features (25)

51. Interview Q&A flashcard bank (spaced repetition)
52. On-site Linux 300-command searchable cheat sheet
53. BMI & Health calculator (original plan gap)
54. World News page (original plan gap)
55. Statistics calculator (original plan gap)
56. Contact form (backend)
57. Canada salary calculator (gross → net)
58. Certification tracker (CFA/ITIL/CKA progress bars)
59. "Hire me" CTA section
60. Build changelog page
61. Orchestrade-style terminal simulator (awaiting his pick: Orchestrade vs X-One)
62. X-One simulator variant (SocGen platform)
63. Risk engine v1: PnL + VaR + ES + stress + limits + greeks + margin + dashboard
64. Trade blotter export (CSV download from trading app)
65. Backtesting mini-lab (strategy vs historical sim data)
66. Economic calendar widget (free API)
67. Currency converter (live FX rates API)
68. Market status board (open/closed per exchange, countdown)
69. Sentiment poll (visitors vote bull/bear, backend counters)
70. Leaderboard for games (backend-persisted high scores)
71. Daily markets quiz (new questions each day)
72. "This day in markets" history card
73. Sitemap page
74. 404 page (themed, with robot bear)
75. Accessibility pass (contrast, focus, screen-reader labels)

## TRACK 4 — Career & Job Hunt (25)

76. Resume A/B variants (support-heavy vs markets-heavy)
77. Cover letter generator (role → tailored letter)
78. LinkedIn profile rewrite checklist
79. STAR story bank (10 stories from his 5 years, interview-ready)
80. "Tell me about yourself" 90-second script
81. Mock interview mode (timed Q&A with scoring)
82. Recruiter email templates (follow-up, thank-you, nudge)
83. Job tracker (applications, stages, follow-ups — backend)
84. Offer comparison calculator (salary, bonus, benefits, commute)
85. Reference list page (private)
86. Skills matrix vs job postings (gap analysis)
87. ITIL v4 quiz bank
88. CFA Level 1 quiz bank (quant + portfolio mgmt)
89. SQL interview drills (live, timed)
90. Linux interview drills (live, timed)
91. FIX protocol interview drills
92. Incident storytelling workshop (how to narrate a sev-1)
93. Salary negotiation one-pager (talking points)
94. 30-60-90 day plan template (for "how would you start" questions)
95. Networking tracker (who he talked to, where, follow-up)
96. Conference/meetup list (Montreal finance-tech)
97. Personal brand: "production support notes" blog
98. GitHub profile README polish
99. Video intro script (60 seconds, for recruiters)
100. Weekly review ritual (metrics: applications, interviews, skills)

## Tomorrow's session format

Hands-on. Financial knowledge + DevOps expert track first:
Git → Jenkins → Gerrit → Docker → Kubernetes → Terraform → Ansible → YAML,
interleaved with finance drills (lifecycle → FIX → risk).
Concept → live command → drill → review, repeat until fluent.
