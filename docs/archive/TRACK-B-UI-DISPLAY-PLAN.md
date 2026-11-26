# TRACK B: UI DISPLAY LAYER - Complete Plan

**Status**: STARTING  
**Date**: 2026-09-07  
**Duration**: 1 week (7 days)  
**Target**: Production-ready UI for Ashtakavarga + Divisional Charts

---

## OBJECTIVE

Display all calculated ashtakavarga + divisional chart data in user-friendly visual formats:
1. Tabular view (data grid)
2. Graphical view (chakra wheels)
3. Heatmaps (visual strength indicators)
4. Mobile responsive
5. Integration with existing Solutions widget

---

## COMPONENTS TO BUILD

### Component 1: Varga Chart Display (Divisional Charts Table)
**What**: Display all 16 divisional charts (D1-D60) in tabular format

**Features**:
- Tab switcher: D1, D2, D3... D60
- Table: House | Rasi | Degree | Signification
- Color coding: Benefic (green), Neutral (yellow), Malefic (red)
- Mobile: Stack vertically, scrollable table

**File**: `src/ui/vargaDisplay.js`  
**Size**: ~300 lines  
**Time**: 2 days  

---

### Component 2: Ashtakavarga Heatmap
**What**: 7×12 grid showing bindu strength per planet per house

**Features**:
- X-axis: 12 houses (Mesha-Meena)
- Y-axis: 7 planets (Sun, Moon, Mars... Venus)
- Cell colors: 0 bindus (red) → 8 bindus (green)
- Cell values: Show actual bindu count
- Legend: Color scale 0-8
- Hover tooltip: Show planet + house + classification

**File**: `src/ui/ashtakavargaHeatmap.js`  
**Size**: ~350 lines  
**Time**: 2 days  

---

### Component 3: Chancha Chakra Visualization
**What**: House-based grouping display (Kendra, Panapara, Apoklima)

**Features**:
- 3-segment circular chart (or bar chart)
- Segment 1: Kendra (112 points in example)
- Segment 2: Panapara (122 points)
- Segment 3: Apoklima (110 points)
- Color intensity: Strength indicator
- Show totals + percentages
- Display strength label (Excellent/Good/Average)

**File**: `src/ui/chancharChakraChart.js`  
**Size**: ~200 lines  
**Time**: 1.5 days  

---

### Component 4: Integration Layer
**What**: Connect UI components + manage data flow

**Features**:
- Accept birth chart data
- Calculate all ashtakavarga values
- Pass to display components
- Tab navigation between views
- Export to PDF (nice-to-have)

**File**: `src/ui/ashtakavargaPanel.js`  
**Size**: ~250 lines  
**Time**: 1 day  

---

## TIMELINE (7 days)

```
Day 1:   Component 1 skeleton + data binding (Varga charts table)
Day 2:   Component 1 styling + mobile responsive
Day 3:   Component 2 heatmap implementation (Ashtakavarga grid)
Day 4:   Component 3 chakra visualization (house grouping)
Day 5:   Integration layer (connect all components)
Day 6:   Testing + mobile verification
Day 7:   Polish + documentation
```

---

## STYLING & DESIGN

### Color Scheme
- **Benefic**: Green (#00A86B)
- **Neutral**: Yellow (#FFD700)
- **Malefic**: Red (#DC143C)
- **Background**: Light gray (#F5F5F5) / Dark (#2A2A2A) for dark mode
- **Text**: Black (#333333) / White (#FFFFFF)

### Responsive Breakpoints
- Desktop: >1024px (full layout)
- Tablet: 768-1024px (stacked 2-col)
- Mobile: <768px (single column, scrollable tables)

### Typography
- Headers: 18px, bold, #333
- Table headers: 14px, bold, #555
- Cell values: 12px, center-aligned
- Labels: 13px, regular

---

## TECHNICAL STACK

**Frontend Framework**: React (if available in project) or vanilla JS  
**Charting**: SVG for chakra wheels, HTML tables for data  
**Styling**: CSS Grid + Flexbox  
**Mobile**: Media queries  
**Dark Mode**: CSS variables (already in project)  

---

## FILES TO CREATE

```
src/ui/
├── vargaDisplay.js           (Divisional charts table, 300 lines)
├── vargaDisplay.css          (Styling, 150 lines)
├── ashtakavargaHeatmap.js    (Bindu grid, 350 lines)
├── ashtakavargaHeatmap.css   (Styling, 100 lines)
├── chancharChakra.js         (House grouping chart, 200 lines)
├── chancharChakra.css        (Styling, 80 lines)
├── ashtakavargaPanel.js      (Integration, 250 lines)
├── ashtakavargaPanel.css     (Styling, 120 lines)
├── index.js                  (Export all components, 50 lines)
└── constants.js              (Colors, labels, 100 lines)

test/
├── test-varga-display.js          (50+ tests)
├── test-ashtakavarga-heatmap.js   (50+ tests)
└── test-chanchar-chakra.js        (30+ tests)
```

**Total**: ~2000 lines of code (UI + CSS + tests)

---

## INTEGRATION WITH EXISTING PROJECT

### Where to use
1. **Solutions Widget** (S27): Add "Ashtakavarga Analysis" tab
2. **Birth Chart View**: Add toggle to show ashtakavarga overlay
3. **Report Builder** (S12): Add ashtakavarga section

### Data flow
```
Birth Chart (Rasi positions)
    ↓
calculateAshtakavarga() (existing S9)
    ↓
calculateAshtakavargaVariations() (new Track A)
    ↓
AshtakavargaPanel (new Track B)
    ├→ VargaDisplay (16 charts)
    ├→ AshtakavargaHeatmap (7×12 grid)
    └→ ChancharChakra (house grouping)
```

---

## SUCCESS CRITERIA

✅ All 16 divisional charts displayable in tabular format  
✅ Ashtakavarga heatmap shows all 84 cells (7×12)  
✅ Chancha Chakra shows correct totals (Kendra/Panapara/Apoklima)  
✅ Mobile responsive (tested on 375px+)  
✅ Dark mode support  
✅ All colors accessible (WCAG AA compliant)  
✅ 130+ tests passing  
✅ Performance: Page loads <1 second  

---

## STRETCH GOALS (If time allows)

- [ ] Export to PDF report
- [ ] Print-friendly CSS
- [ ] Comparison view (two charts side-by-side)
- [ ] Animation on hover
- [ ] Custom color themes
- [ ] Accessibility tooltips

---

## GIT COMMITS

Will commit daily:
- Day 1: "Track B.1: Varga charts table component"
- Day 2: "Track B.2: Ashtakavarga heatmap + styling"
- Day 3: "Track B.3: Chancha Chakra visualization"
- Day 4: "Track B.4: Integration layer + testing"
- Day 5: "Track B.5: Mobile responsive + dark mode"
- Day 6: "Track B.6: Final polish + documentation"

---

## READY TO START

Next step: Create vargaDisplay.js (Component 1) with:
- 16-chart tab switcher
- Data table structure
- Basic styling
- Test suite

**Estimated completion**: Today (Day 1 evening)

