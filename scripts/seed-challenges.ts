import { api } from "../convex/_generated/api";

export default async function seedChallenges(ctx: any) {
  const challenges = [
    {
      slug: "center-the-div",
      title: "Center the Div",
      description:
        "Use CSS Flexbox to perfectly center the pink square inside its container. The container is a full-screen height section.",
      category: "CSS Basics",
      difficulty: 1,
      xpReward: 100,
      starterCode: {
        html: '<div class="container">\n  <div class="box"></div>\n</div>',
        css: ".container {\n  height: 50vh;\n  border: 2px dashed #8b8076;\n}\n\n.box {\n  width: 100px;\n  height: 100px;\n  background: #ff00ff;\n  box-shadow: 0 0 20px rgba(255, 0, 255, 0.5);\n}",
        js: "",
      },
      validation: {
        type: "computed-style",
        rules: [
          {
            selector: ".container",
            property: "display",
            expected: "flex",
            hint: "Try setting the display property of the container to flex.",
          },
          {
            selector: ".container",
            property: "justifyContent",
            expected: "center",
            hint: "Use justify-content: center to center along the main axis.",
          },
          {
            selector: ".container",
            property: "alignItems",
            expected: "center",
            hint: "Use align-items: center to center along the cross axis.",
          },
        ],
      },
      hints: [
        "The parent container needs a specific layout mode.",
        "Flexbox is the most modern way to do this. Try `display: flex;`.",
        "To center vertically and horizontally in flexbox, you need two properties: `justify-content` and `align-items`.",
      ],
      order: 1,
    },
    {
      slug: "responsive-text",
      title: "Responsive Typography",
      description:
        "Make the headline text responsive so it fills 5% of the viewport width. Use the correct relative unit.",
      category: "CSS Basics",
      difficulty: 1,
      xpReward: 150,
      starterCode: {
        html: '<h1 id="title">Hello World</h1>',
        css: "#title {\n  font-weight: bold;\n  color: #ff00ff;\n}",
        js: "",
      },
      validation: {
        type: "computed-style",
        rules: [
          {
            selector: "#title",
            property: "fontSize",
            expected: "5vw", // This is a bit tricky with computed style as it returns px
            hint: "Use the 'vw' (viewport width) unit.",
          },
        ],
      },
      hints: ["Viewport units are perfect for this!", "Try using 'vw' as the unit for font-size."],
      order: 2,
    },
  ];

  for (const challenge of challenges) {
    // Check if challenge already exists
    const existing = await ctx.db
      .query("challenges")
      .withIndex("by_slug", (q: any) => q.eq("slug", challenge.slug))
      .unique();

    if (!existing) {
      await ctx.db.insert("challenges", challenge);
      console.log(`Inserted challenge: ${challenge.title}`);
    } else {
      console.log(`Challenge already exists: ${challenge.title}`);
    }
  }
}
