# User Scenarios: EduPlanner DSA in Action

This document illustrates the practical, day-to-day value of EduPlanner DSA through a series of narrative user flows. These stories translate the platform's technical features into tangible benefits, demonstrating how students and educators interact with the AI to create a richer, more effective learning experience.

Story 1: [El Algoritmo del Éxito](https://g.co/gemini/share/fa96a6d4185e)

---

### Scenario 1: Alex – The Bright but Hasty Student

<img width="2339" height="1221" alt="image" src="https://github.com/user-attachments/assets/0274091d-2670-4fe2-b416-ef2135677ef3" />

**Persona:** Alex is a bright computer science student who grasps complex concepts quickly. His AI-generated **Cognitive Profile** reflects this: high "Abstract Thinking" (4.5/5) and "Pattern Recognition" (4.3/5). However, he often rushes, leading to a lower "Attention to Detail" (3.2/5).

**The Journey:**

1.  **Getting a Challenge:** Alex logs in and checks his **Intelligent Recommendations**. The AI suggests a "Medium" difficulty problem about finding cycles in a graph. The AI-generated justification reads: *"Based on your strong progress with graph traversal, this problem offers a great opportunity to apply that knowledge in a new context."* Intrigued, Alex starts the challenge in the **Practice Lab**.

2.  **Planning the Attack:** In the "Strategy Planner," Alex quickly devises a clever approach using a variation of Depth-First Search (DFS). He outlines his plan: "I'll use a recursive DFS and keep track of visited nodes in a hash set to detect a back edge to a node already in the current recursion stack."

3.  **Instant Strategy Feedback:** Before coding, Alex clicks "Get Feedback on Plan." The AI responds in seconds.
    -   **Feedback:** *"Excellent approach, Alex! Using a recursion stack to detect back edges is the most efficient way to solve this. Your plan is solid. One quick thought: what happens if the graph is not connected and contains multiple components?"*
    -   **Cognitive Insight:** The AI logs an internal inference: `[+0.1 to Abstract Thinking: Correctly identified an optimal, non-obvious approach], [-0.05 to Attention to Detail: Plan did not account for disconnected components, a common edge case]`. His profile subtly updates.

4.  **Coding and Submission:** Alex smirks, realizing he missed the edge case. He adjusts his mental model and writes the code, wrapping his DFS call in a loop to handle all nodes. He submits his solution.

5.  **The Code Review:** The AI provides a full review.
    -   **Result:** "Solution Accepted!"
    -   **Feedback:** *"Great work! Your code is clean, efficient, and correctly handles disconnected graphs. The use of recursion is elegant. A minor style suggestion would be to use a more descriptive variable name for your visited set."*
    -   **Cognitive Insight:** The AI logs another inference: `[+0.1 to Attention to Detail: Code correctly handled the previously missed edge case]`.

**Outcome:** Alex didn't just solve a problem. He was challenged on his specific cognitive weakness in a constructive way, received instant feedback that reinforced a better habit, and saw his Cognitive Profile improve, all within a single 15-minute exercise.

---

### Scenario 2: Ben – The Cautious Beginner

<img width="2355" height="1221" alt="image" src="https://github.com/user-attachments/assets/8b1289d4-d35c-421c-9da5-a9e7ade6c435" />

**Persona:** Ben is in his first introductory DSA course. He finds the concepts abstract and is sometimes overwhelmed. He needs structure and clear, foundational explanations.

**The Journey:**

1.  **Finding a Path:** Ben logs in and navigates to the **Learning Paths** page. He selects the "DSA Fundamentals" path. He sees the first topic is "Stacks."

2.  **Adaptive Learning:** Ben clicks "Start Learning" and an **Adaptive Learning Module** is generated for him. The AI, noting his beginner status and lower "Abstract Thinking" score (2.8/5), tailors the content:
    -   **Explanation:** The module begins not with technical jargon, but with a simple, concrete analogy: *"Imagine a stack of plates. You can only add a new plate to the top, and you can only take a plate from the top. This is the 'Last-In, First-Out' (LIFO) principle of a stack."*
    -   **Quiz:** The quiz question at the end is foundational, designed to check his core understanding rather than trick him with complex edge cases.

3.  **Visualizing Success:** After completing the module, Ben returns to his **Dashboard**. He is greeted by a rewarding animation on the **Skill Tree Visualizer**. The "Stacks" node, previously red ("Not Started"), now glows yellow ("In Progress"). This visual feedback gives him a tangible sense of accomplishment and a clear map of what's next.

4.  **Getting Unstuck:** Later in the module, Ben encounters a concept he doesn't fully grasp. He clicks the **"Explain Further"** button. The AI provides a "Deeper Dive" explanation, breaking down the concept with a pseudo-code example and another analogy, solidifying his understanding without him having to leave the platform to search for answers.

**Outcome:** Ben receives a learning experience tailored to his needs. The intimidating, abstract world of DSA is made accessible through personalized analogies and a structured path. The visual feedback from the Skill Tree motivates him to continue his journey.

---

### Scenario 3: Dr. Evans – The Engaged Instructor

<img width="2360" height="1218" alt="image" src="https://github.com/user-attachments/assets/6ee99444-3fef-4190-84d4-e2b7cdb190c1" />

**Persona:** Dr. Evans is a university professor who uses EduPlanner DSA to supplement her DSA course. She wants to monitor her students' progress and ensure the AI's guidance aligns with her teaching goals.

**The Journey:**

1.  **Classroom Overview:** Dr. Evans logs into the **Teacher Dashboard**. She gets an at-a-glance view of her class's progress (a feature in development). She notices that while most of the class is advancing well, Alex seems to be struggling with problems that require careful handling of constraints, even though he aces the conceptual quizzes.

2.  **Fine-Tuning the AI:** She navigates to the **"Cognitive Profile Tuning"** tool and selects Alex's profile. She sees the AI has his "Attention to Detail" rated at 3.2/5, which aligns with his performance data. However, based on a recent in-class discussion where Alex showed a breakthrough in understanding edge cases, she believes his ability is slightly higher.

3.  **Educator-AI Synergy:** Dr. Evans uses the slider to adjust Alex's "Attention to Detail" score from 3.2 to 3.6. A dialog prompts her for a brief justification: *"Alex demonstrated a strong grasp of handling null inputs during today's lecture discussion."*

4.  **Calibrating the System:** She submits her change. This action does two things:
    -   It provides the underlying AI model with **invaluable ground-truth data**, helping it learn and improve its inferences for all students.
    -   It immediately **re-calibrates the system for Alex**. The next time Alex requests a "Challenge Me!" problem, the AI will factor in this new, teacher-validated score, potentially giving him a slightly more complex problem that respects his recent growth.

<img width="2349" height="1236" alt="image" src="https://github.com/user-attachments/assets/2718de87-0760-4fd8-a7d0-87e310c03c7f" />

**Outcome:** Dr. Evans acts as the "expert-in-the-loop." She uses her professional judgment to enhance the AI's understanding, ensuring the personalized learning experience is not just data-driven, but also informed by human pedagogical insight. The platform becomes a powerful assistant that helps her scale her teaching effectively.

