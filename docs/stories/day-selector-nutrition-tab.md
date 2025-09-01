# Day Selector in Nutrition Tab - Brownfield Addition

## Story Title
Day Selector in Nutrition Tab - Brownfield Addition

## User Story
As a **usuário da aba de nutrição**,
I want **um seletor de dias da semana como primeiro card na aba de nutrição**,
So that **eu possa navegar entre diferentes dias e ver as calorias e refeições específicas de cada dia sem precisar abrir um popup**.

## Story Context

**Existing System Integration:**
- Integrates with: `NutricaoTab.tsx` component and existing `useWeeklyMealPlan` hook
- Technology: React/TypeScript, Tailwind CSS, existing `DaySelector` component
- Follows pattern: Existing card pattern and reuses `DaySelector` from weekly popup
- Touch points: 
  - `NutricaoTab.tsx` layout and state management
  - `useWeeklyMealPlan` hook for day-specific data
  - `MacroGoalsCard` and `MealCard` components (will receive dynamic data)
  - Existing `DaySelector` component from weekly popup

## Acceptance Criteria

**Functional Requirements:**
1. **Day Selector Card**: Day selector appears as the **first card** in nutrition tab with pills for each day (Seg, Ter, Qua, Qui, Sex, Sáb, Dom)
2. **Day Navigation**: Clicking any day pill updates the selected day and refreshes data in cards below
3. **Dynamic Content Update**: Daily calories card and meal cards below automatically update to show data for the selected day

**Integration Requirements:**
4. Existing `MacroGoalsCard` and `MealCard` components continue to work but now receive dynamic data based on selected day
5. New day selector card follows existing card visual pattern (white background, shadow-2xl, rounded-3xl styling) 
6. Integration with existing `useWeeklyMealPlan` hook to fetch day-specific nutrition data
7. Default selection should be current day of the week (today)

**Quality Requirements:**
8. Day selection state is maintained during nutrition tab session (doesn't reset when switching tabs)
9. Loading states are handled gracefully while fetching day-specific data
10. Error states show appropriate messages if day data cannot be loaded
11. No regression in existing nutrition tab functionality verified

## Technical Notes

- **Integration Approach**: 
  - Add state management for selected day in `NutricaoTab.tsx`
  - Reuse existing `DaySelector` component from weekly popup
  - Integrate `useWeeklyMealPlan` hook to provide day-specific data
  - Update prop passing to `MacroGoalsCard` and meal rendering logic
- **Existing Pattern Reference**: 
  - `DaySelector` component already exists in `components/nutrition/DaySelector.tsx`
  - `useWeeklyMealPlan` hook provides structured day data
  - Card wrapper follows same pattern as other cards
- **Data Flow**: selectedDay state → useWeeklyMealPlan → day-specific data → update cards below
- **Key Constraints**: 
  - Must maintain all existing responsive behavior
  - Must handle all existing states (loading, error, hasNoMealPlan)
  - Day selector should be disabled/hidden in loading and error states

## Definition of Done

- [ ] Day selector card created as first element in nutrition tab
- [ ] `DaySelector` component integrated and styled as a card
- [ ] Selected day state management implemented in `NutricaoTab.tsx`
- [ ] `useWeeklyMealPlan` hook integrated for day-specific data fetching
- [ ] `MacroGoalsCard` receives and displays day-specific calorie data
- [ ] Meal cards update to show meals for selected day
- [ ] Default day selection is current day of the week
- [ ] Day selection state persists during nutrition tab session
- [ ] Loading and error states handle day selector appropriately
- [ ] Responsive layout works on mobile and desktop
- [ ] No regression in existing nutrition tab behavior

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk**: State management complexity and data flow changes affecting existing functionality
- **Mitigation**: Implement day state at NutricaoTab level, ensure backward compatibility with existing prop structure, test all states thoroughly
- **Rollback**: Remove day selector card and state management, revert to static "today" data flow

**Compatibility Verification:**
- [ ] Changes to `NutricaoTabProps` are backward compatible or properly updated in parent components
- [ ] No database changes required (uses existing weekly plan data)
- [ ] UI changes follow existing design patterns exactly
- [ ] Performance impact is minimal (similar to existing weekly popup data loading)

## Validation Checklist

**Scope Validation:**
- [ ] Story requires state management changes (may need 4-6 hours due to integration complexity)
- [ ] Integration approach reuses existing components and patterns
- [ ] Follows existing card and day selector patterns
- [ ] Some additional complexity due to data flow changes but manageable in single story

**Clarity Check:**
- [ ] Day selector positioning and behavior clearly specified
- [ ] Integration with existing hook and components clearly defined
- [ ] Success criteria are testable (day selection, data updates, state persistence)
- [ ] Rollback approach is feasible (remove state management and revert to static flow)

## Implementation Notes

### Component Structure
```typescript
// Enhanced NutricaoTab.tsx with day selection state
interface NutricaoTabState {
  selectedDay: string; // 'monday', 'tuesday', etc.
}

// New DaySelectorCard component
interface DaySelectorCardProps {
  selectedDay: string;
  onDaySelect: (day: string) => void;
  availableDays: string[];
  disabled?: boolean;
}
```

### Integration Points
1. **NutricaoTab.tsx**: Add day state management and integrate useWeeklyMealPlan
2. **DaySelector reuse**: Create DaySelectorCard wrapper around existing DaySelector
3. **Data flow**: selectedDay → useWeeklyMealPlan → selectedDayData → update existing cards
4. **Default behavior**: Auto-select current day of week on tab load

### Visual Design Requirements
- **Day Selector Card**:
  - Background: `bg-white`
  - Border: `border-0`  
  - Shadow: `shadow-2xl`
  - Border radius: `rounded-3xl`
  - Padding: `p-6` on CardContent
  - Title: "Selecionar Dia" or similar
- **Day Pills**: Reuse existing DaySelector styling with Aleen.ai colors
- **Card Spacing**: Maintain existing `space-y-6` between all cards

### State Management
```typescript
// Default to current day of week
const getCurrentDayKey = () => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[new Date().getDay()];
};

const [selectedDay, setSelectedDay] = useState(getCurrentDayKey());

// Use existing hook with dynamic day
const { selectedDayData } = useWeeklyMealPlan({ 
  userId, 
  isOpen: true, // Always fetch in nutrition tab
  selectedDay 
});
```

## Success Criteria

The story is successful when:
1. ✅ Day selector card appears as first card with interactive day pills
2. ✅ Selecting different days updates calories and meals in cards below  
3. ✅ Current day is selected by default when opening nutrition tab
4. ✅ Day selection state persists during nutrition tab session
5. ✅ All existing card functionality maintained with dynamic data
6. ✅ Loading and error states handle day selector appropriately
7. ✅ Responsive behavior works correctly across all device sizes
