# Features Guide

Let me walk you through everything this dashboard can do. It's pretty straightforward once you get the hang of it.

## Routes Management

This is your main hub for tracking all maritime routes.

**What you can do:**

- **View all routes** - See every voyage with details like vessel type, fuel type, GHG intensity, and emissions
- **Filter like a pro** - Filter by vessel type (Container, Tanker, etc.), fuel type (HFO, LNG, MGO), or year
- **Set baselines** - Pick one route as your baseline reference point for comparisons
- **Real-time updates** - Everything updates instantly as you interact with the data

The interface is clean and intuitive. You'll see cards for each route with all the key metrics visible at a glance.

## Comparison Analysis

Want to see how your routes stack up? That's what this tab is for.

**Here's what happens:**

1. The dashboard calculates target intensity based on EU regulations (it varies by year)
2. Compares each route's actual GHG intensity against that target
3. Shows you whether you're compliant or not
4. Gives you a nice bar chart visualization to see trends

**The target intensity changes over time:**
- 2025: 2% reduction from baseline
- 2030: 6% reduction
- 2035: 14.5% reduction
- And it keeps getting stricter until 2050 (80% reduction)

So basically, the regulations tighten up gradually, and this tab helps you see if you're keeping pace.

## Banking (Article 20)

This is where things get interesting. If you're doing better than required, you can bank that extra compliance for later.

**How it works:**

Think of it like a savings account for compliance. If your ship has a positive compliance balance (you're emitting less than your target), you can:

1. **Bank the surplus** - Save it for a year when you might fall short
2. **Check your balance** - See exactly how much you have banked and available
3. **Apply banked credits** - Use your saved surplus to cover a deficit in another year

**The FIFO rule:**

When you apply banked credits, we use First In, First Out. That means we automatically pull from your oldest banked credits first. This follows the regulation requirements and makes sense intuitively.

**Visual feedback:**

The interface shows you:
- Current compliance balance (red if negative, green if positive)
- Total banked amount available
- How much you can bank right now
- Before/after states when you bank or apply credits

## Pooling (Article 21)

This is the team sport version of compliance. Multiple ships can pool their balances together.

**Why would you do this?**

Let's say Ship A has a deficit (emitting too much) and Ship B has a surplus (doing great). Instead of Ship A facing penalties and Ship B wasting credits, they can pool together. The surplus from Ship B can offset Ship A's deficit.

**How we make it work:**

1. **Add members to your pool** - Select ships and enter their compliance balances
2. **Automatic allocation** - Our greedy algorithm distributes the pool total fairly
3. **Real-time validation** - The system checks three critical rules:
   - Pool sum must be ≥ 0 (can't create a negative pool)
   - Ships with deficits can't end up worse
   - Ships with surplus can't end up negative
4. **Create the pool** - If validation passes, the pool is created and balances are updated

**The math behind it:**

We use a greedy algorithm that:
- Calculates the total pool balance
- Distributes proportionally based on each ship's contribution
- Ensures everyone follows the rules
- Shows you exactly what happens to each ship's balance

**Visual breakdown:**

You'll see a before/after comparison showing:
- Each ship's starting balance
- The allocation they receive
- Their final balance after pooling
- Whether the pool is valid (green checkmark) or has issues (red X)

## UI/UX Features

We spent time making this actually pleasant to use:

**Dark bluish theme** - Easy on the eyes, especially for long sessions. The maritime blue color scheme feels appropriate for the domain.

**Glassmorphism effects** - Those semi-transparent, blurred backgrounds that give it a modern feel without being distracting.

**Smooth animations** - Everything fades in, slides, and transitions smoothly. No jarring movements.

**Responsive design** - Works on mobile, tablet, and desktop. Try resizing your browser window.

**Professional icons** - We use React Icons throughout for consistency.

**User-friendly errors** - If something goes wrong, you get clear messages in plain English. No cryptic error codes.

## Sample Data Breakdown

When you seed the database, here's what you get:

| Route | Vessel Type   | Fuel | Year | GHG Intensity | Fuel (tonnes) |
|-------|---------------|------|------|---------------|---------------|
| R001  | Container     | HFO  | 2024 | 91.0          | 5000          |
| R002  | BulkCarrier   | LNG  | 2024 | 88.0          | 4800          |
| R003  | Tanker        | MGO  | 2024 | 93.5          | 5100          |
| R004  | RoRo          | HFO  | 2025 | 89.2          | 4900          |
| R005  | Container     | LNG  | 2025 | 90.5          | 4950          |

**R001 is your baseline** (91.0 gCO₂e/MJ)

This gives you a nice mix to test with:
- Different vessel types (containers, tankers, carriers)
- Different fuels (HFO, LNG, MGO)
- Two years of data
- Some routes compliant, some not

## Performance Optimizations

We care about speed:

**Frontend:**
- Code splitting so you only load what you need
- Lazy loading for heavy components
- React.memo to prevent unnecessary re-renders

**Backend:**
- Optimized Prisma queries
- Database connection pooling
- Indexes on frequently queried fields

**API:**
- Response caching for static data
- Efficient data structures

You should notice everything feels snappy, even with large datasets.

## Accessibility

We tried to make this usable for everyone:

- Clear color contrasts
- Descriptive alt texts
- Keyboard navigation support
- Screen reader friendly
- Touch-friendly on mobile devices

## Testing Checklist

Want to verify everything works? Here's what to test:

**Routes Tab:**
- [ ] Routes load without errors
- [ ] Filters work (vessel type, fuel type, year)
- [ ] Can set a baseline route
- [ ] Cards display all data correctly

**Compare Tab:**
- [ ] Shows baseline route information
- [ ] Displays target intensity for the year
- [ ] Compares all routes correctly
- [ ] Bar chart renders and is interactive

**Banking Tab:**
- [ ] Shows current compliance balance
- [ ] Can bank surplus when available
- [ ] Can apply banked credits when needed
- [ ] Bank records display correctly
- [ ] Before/after states are accurate

**Pooling Tab:**
- [ ] Can add pool members
- [ ] Validation works (shows errors for invalid pools)
- [ ] Can create a valid pool
- [ ] Before/after comparison displays correctly
- [ ] Allocation results make sense

## Tips and Tricks

**Want to see banking in action?**
1. Go to Routes and find a route with low GHG intensity
2. Check the Compare tab to confirm it's compliant
3. Head to Banking and bank the surplus
4. Check your bank records to see it saved

**Testing pooling?**
1. You need at least one ship with surplus and one with deficit
2. Add both to a pool
3. The system will show you if it's valid
4. If valid, create it and see the balances update

**Quickly filter routes?**
- Use multiple filters together for precise results
- Clear filters with the reset button

**Charts not showing?**
- Make sure you have data for the selected year
- Check that the baseline route is set

---

That's the full tour! Play around with it.