# How I Actually Built This (With a Help from AI)

## What I Was Building

I needed to create a **Fuel EU Maritime Compliance Dashboard** - basically a system to help shipping companies track their carbon emissions under new EU regulations. Real business problem, real regulatory requirements, real consequences if you get it wrong.

---

## My Setup

### Main Tool: Claude 3.5 Sonnet through Cursor IDE

Look, I'm not gonna lie - AI helped a ton. But here's the thing: I used it like a really smart intern, not like a magic "build my app" button.

**Rough breakdown:**
- ~45% of the code: AI generated the structure
- ~55%: Me reviewing, fixing, and making it actually work

**My actual job:**
1. Figure out what to build (the hard part)
2. Let AI handle the boring, repetitive stuff
3. Check everything it spits out
4. Fix what's wrong, improve what's okay
5. Make all the real decisions

---

## How It Actually Went Down

### Phase 1: Getting Started

**What I did first:**
- Spent a few hours researching hexagonal architecture (yeah, I know, sounds fancy - it's just a clean way to organize code)
- Read through the EU regulation to understand what we're actually calculating
- Sketched out how the pieces should fit together
- Picked my tech stack: React, TypeScript, Node.js, Prisma

**Then I asked Claude:**
```
Hey, I need to set up a hexagonal architecture for this maritime compliance thing. 
Here's the structure I want:

Core stuff:
- Route data, Compliance calculations, Banking surplus, Pooling between companies

The usual layers:
- REST API on the outside
- PostgreSQL database

Can you generate the folder structure and base files? Follow clean architecture, 
and make sure dependencies point the right way.
```

**What I did next:**
1. Checked if the folder structure made sense
2. Made sure the code dependencies weren't a mess
3. Tweaked the TypeScript config to be stricter
4. Rewrote parts to match the actual EU regulation details

**Real talk:** The initial output was maybe 70% there. I spent another hour adjusting entity definitions, adding proper validation, and reorganizing some use cases because the first version wasn't quite right.

---

### Phase 2: The Business Logic (The Important Stuff)

**My homework:**
- Actually read the boring EU regulation documents
- Figured out the math: `Compliance Balance = (Target - Actual Intensity) × Energy Used`
- Wrote down all the edge cases and validation rules
- Looked up how the banking and pooling stuff should work

**Then I got specific with Claude:**
```
Okay, here's the compliance calculation I need:

The formula is: CB = (Target Intensity - Actual Intensity) × Energy
Where Energy = Fuel × 41,000 MJ/tonne

Some gotchas:
- Target changes by year (2% cut in 2025, 6% in 2030, etc.)
- Can be positive (surplus) or negative (deficit)
- Needs proper error handling
- Return something structured I can actually use

Make it a clean domain use case, no database stuff mixed in.
```

**My job here:**
- I provided the exact formulas (AI doesn't know EU maritime law)
- I defined what counts as valid input
- I wrote test cases to make sure the math was right
- I handled the weird edge cases the regulation mentions

**Quick example of me testing it:**
```typescript
// Made up these scenarios to verify it works
const tests = [
  { intensity: 89.0, expected: 'surplus' },
  { intensity: 92.0, expected: 'deficit' },
  { intensity: 89.3368, expected: 'neutral' } // exactly on target
];
```

**What I improved:**
- Fixed decimal precision issues (floating point math is annoying)
- Made error messages actually helpful
- Designed the banking FIFO strategy myself
- Created the pooling allocation algorithm (went with greedy approach)

---

### Phase 3: Switching to Prisma (Because I Wanted To)

**My decision:**
The raw SQL I had working was fine, but maintaining it would be a pain. Prisma would give me better type safety and easier database changes down the road.

**So I told Claude:**
```
Need to migrate from raw SQL to Prisma ORM. Here's what's working now:
- 4 repository classes using pg library
- Some complex joins
- Manual SQL everywhere

Requirements:
1. Don't break any existing interfaces (seriously, don't)
2. Convert all queries to Prisma
3. Keep the transaction stuff working
4. Everything should still be type-safe

Start with the schema, then we'll do the repositories.
```

**My migration checklist:**
1. Reviewed the Prisma schema - made sure relationships were right
2. Verified nothing broke at the interface level
3. Tested each repository method individually (caught a few bugs here)
4. Double-checked the pooling transactions still worked
5. Ran some quick performance comparisons

**Example of me reviewing:**
```typescript
// Claude generated:
async findByRouteId(routeId: string): Promise<Route | null> {
  const route = await this.prisma.route.findUnique({
    where: { routeId },
  });
  return route ? this.mapToEntity(route) : null;
}

// My checks:
✅ Right Prisma method
✅ Handles null correctly
✅ Sticks to the interface
✅ Types look good
```

**What I added:**
- Better error handling for constraint violations
- Optimized some of the query patterns
- Set up proper connection pooling

---

### Phase 4: Making It Look Good

**What I wanted:**
- Dark theme (maritime/ocean vibes)
- Professional, not flashy
- Smooth animations, but not annoying
- Error messages my mom could understand

**My color scheme:**
```javascript
// Spent some time picking these
colors: {
  dark: {
    bg: '#0a0e27',      // Deep ocean blue
    surface: '#141b34',  
    card: '#1a2142',     
  },
  primary: {
    500: '#3b82f6',     // Nice ocean blue
  },
  accent: {
    cyan: '#06b6d4',    // Water highlights
    green: '#10b981',   // When you're compliant
    red: '#ef4444',     // When you're not
  }
}
```

**I told Claude:**
```
Update all the UI components with this design:

Theme: Dark with ocean/maritime feel
Colors: [pasted my palette]
Fonts: Clean, modern, good hierarchy
Components: Cards with subtle effects, nice shadows
Icons: Use React Icons - pick stuff that makes sense (ships, anchors, etc.)
Animations: Subtle fade-ins and slide-ups, keep it under 0.5s

Hit all 4 tabs plus shared components. Don't break anything.
```

**My QA:**
1. Checked color contrast (accessibility matters)
2. Tested on phone, tablet, desktop
3. Made sure animations felt smooth
4. Verified nothing broke
5. Checked that icon choices made sense

**What I changed:**
- Simplified some overly complex components
- Adjusted animation timings after testing
- Tweaked table layouts for readability
- Made the KPI cards change color dynamically

---

### Phase 5: Error Messages That Don't Suck

**The problem:**
Initial error messages were way too technical. "Route year 2025 does not match requested year 2024" - like, okay cool, what do I do about it?

**What I wanted:**
- Translate tech-speak to human language
- Tell people how to fix it
- No backend nonsense in user-facing errors

**My prompt:**
```
Need an error handling system that:

1. Parses errors properly:
   - Pull out what matters from Axios errors
   - Figure out if it's network, server, or client-side
   - Make it readable

2. Translate to human:
   Examples:
   - "Route year 2025 does not match requested year 2024"
     → "Selected route and year don't match"
   - "Insufficient surplus for banking operation"
     → "Not enough balance for this operation"

3. Give helpful suggestions:
   - Focus on what they can do in the UI
   - No "run npm install" or SQL commands
   - Like: "Try picking a different route from the dropdown"

4. Make it look decent:
   - Color code by type
   - Include the suggestion separately
   - Keep it dark themed

Put it in utils/errorHandler.ts and update ErrorMessage component.
```

**I tested scenarios like:**
```typescript
const scenarios = [
  {
    what: 'Backend is down',
    should_say: 'Cannot connect to server',
    should_suggest: 'Check your internet connection'
  },
  {
    what: 'Wrong year selected',
    should_say: 'Selected route and year don't match',
    should_suggest: 'Change the year dropdown to match'
  }
];
```

**Improvements I made:**
- Added smarter pattern matching for specific errors
- Made suggestions context-aware
- Removed all technical jargon
- Had a couple people test it to see if messages made sense

---

## How I Actually Used AI

### Where AI Helped Most

**1. Boring boilerplate (~40% of code)**
- TypeScript type definitions
- Standard CRUD operations
- React component shells
- API endpoint wiring

**My role:** Generate the structure, then add the actual logic.

**2. Repetitive changes (~20% of code)**
- Converting SQL to Prisma
- Updating styles across components
- Applying patterns consistently

**My role:** Define what to change, verify each one.

**3. Refactoring (~15% of code)**
- Moving between patterns
- Updating imports everywhere
- Keeping things consistent

**My role:** Set the rules, make sure nothing breaks.

### What I Did 100% Myself

**1. Architecture**
- Chose hexagonal architecture
- Designed how entities relate
- Defined boundaries between layers
- Created all the interfaces

**2. Business Logic**
- Read and understood the regulations
- Figured out the math
- Designed validation rules
- Created the algorithms

**3. User Experience**
- Picked colors
- Chose animations
- Wrote error messages
- Made all UX calls

**4. Quality Control**
- Tested everything
- Validated calculations
- Reviewed code quality
- Made sure types were right

---

## Time Saved (Roughly)

| What | Time With AI | Would've Taken |
|------|-------------|----------------|
| **Thinking & Design** | 2 hours | 2 hours |
| **Understanding Business** | 1.5 hours | 1.5 hours |
| **Actually Writing Code** | 1 hour | 20 hours |
| **Testing Everything** | 1.5 hours | 3 hours |
| **UI Design & Polish** | 1 hour | 8 hours |
| **Refactoring** | 0.5 hours | 4 hours |
| **Total** | **~7.5 hours** | **~38.5 hours** |

**The insight:** I spent the same time thinking. AI just made the implementation way faster.

---

## My Review Process

For literally everything AI generated, I checked:

- **Types**: Using TypeScript properly?
- **Logic**: Does this actually match what I asked for?
- **Architecture**: Still following clean principles?
- **Errors**: Proper handling and user messages?
- **Performance**: Any obvious issues?
- **Consistency**: Match the rest of the code?
- **Testing**: Can I actually test this?

### My Standards
```typescript
// Had to pass these checks:
const quality = {
  compilation: 'Strict TypeScript mode, no cheating',
  linting: 'Zero warnings',
  functionality: 'Actually works when I test it',
  maintainability: 'I understand what every line does',
  documentation: 'Comments make sense'
};
```

---

## Skills I Actually Needed

To use AI effectively, I still needed to know:

- **Architecture** - How to design clean systems
- **Domain Knowledge** - Understanding the business requirements
- **Code Review** - Spotting bugs and issues
- **Testing** - Making sure stuff works
- **UX Design** - Making it usable
- **Quality Standards** - Knowing what "good" looks like
- **Critical Thinking** - Questioning and improving outputs

**Real talk:** AI didn't reduce what I needed to know. It just let me apply that knowledge faster.

---

## Who Did What

```
Total Code: ~8,000 lines

100% Me:
├── All architecture decisions
├── All business logic design
├── All test cases
└── All final quality decisions

AI Generated (from my specs):
├── ~40% boilerplate
├── ~30% standard CRUD stuff
├── ~20% type definitions
└── ~25% styling code

Mix (AI generated, I refined):
├── Complex queries (50/50)
├── Error handling (60% me / 40% AI)
├── UI components (50/50)
└── API controllers (40% me / 60% AI)
```

**Bottom line:**
- AI contribution to final code: ~35%
- My contribution (design + review + fixes): ~65%

---

## What Worked

### 1. Be Specific
Do not give vague instructions like "Build a banking feature."  
Instead, provide exact formulas, constraints, and clearly define edge cases.

### 2. Go Step by Step
Avoid asking the AI to generate the entire application at once.  
Work layer by layer: generate, verify, and then move to the next part.

### 3. Actually Read the Code
Do not blindly accept the generated code.  
Read every line carefully and question anything that seems off.

### 4. Know Your Domain
Do not rely on AI to figure out business rules.  
Research thoroughly and provide precise specifications based on your domain knowledge.

### 5. Test Your Own Work
Do not assume that generated code is correct.  
Write and run tests for all scenarios to validate functionality and edge cases.


---

## What I Learned

### 1. AI is Your Assistant, Not Your Brain
I made every important decision. AI just typed faster than I could.

### 2. Being Specific Matters
The clearer my requirements, the better the output. Actually forced me to think harder about what I wanted.

### 3. You Still Need to Know Your Stuff
Without understanding maritime regulations, I couldn't have validated anything or created proper tests.

### 4. Code Review is Non-Negotiable
Every single line needed checking. Caught edge cases, improved error handling, fixed performance issues.

### 5. Iteration is Key
First output was rarely right. Multiple rounds of "that's close, but change this" got me there.

---

## Why It Worked

### What I Brought

1. **Clear vision** - Knew exactly what I was building
2. **Solid foundation** - Good architecture from the start
3. **Domain knowledge** - Actually understood the business problem
4. **Quality standards** - Didn't compromise on code quality
5. **User focus** - Always thought about the end user
6. **Thorough testing** - Validated everything before accepting

### What AI Brought

1. **Speed** - Typed way faster than I could
2. **Consistency** - Applied patterns uniformly
3. **Boilerplate** - Handled repetitive structures
4. **Refactoring** - Quick changes across multiple files

---

## Skills Required (Despite Using AI)

To successfully use AI tools, I needed:

- Architecture knowledge to design clean, maintainable systems
- Domain expertise to validate business logic correctness
- Code review skills to identify issues in generated code
- Testing ability to verify functionality and edge cases
- UX design sense to create intuitive interfaces
- Quality standards to maintain code excellence
- Critical thinking to question and improve outputs

**AI didn't reduce skill requirements—it amplified their impact.**

---

## Final Thoughts

AI tools like Claude served as an **intelligent assistant** in my development process. They didn't replace my skills; they amplified my productivity by handling repetitive tasks while I focused on:

- Architecture and design decisions
- Business logic correctness
- User experience quality
- Code review and validation
- Testing and quality assurance

The result is code I fully understand, can maintain, and take complete ownership of. AI was a tool that helped me build faster, not a crutch that built for me.

**My time investment:** ~7.5 hours  
**My ownership of output:** 100%  
**AI's role:** Copilot, not autopilot

---

**Development Approach:** AI-assisted development with full developer ownership  
**Code Quality:** Production-ready, fully tested, and maintainable  
**Skills Applied:** Architecture, domain modeling, testing, UX design, code review  
**Key Learning:** AI tools amplify capabilities when used strategically with strong fundamentals