document.addEventListener("DOMContentLoaded", () => {
  const audienceButtons = document.querySelectorAll(".audience-btn");
  const repliesDiv = document.getElementById("replies");
  const resetBtn = document.getElementById("reset");
  const notifyBtn = document.getElementById("notify");
  const emailInput = document.getElementById("email");
  const botCheck = document.getElementById("botCheck");
  const message = document.getElementById("message");

  let selectedAudience = null;
  let selectedSituation = null;
  let replyIndex = {};

  // Situation map per audience
  const situationMap = {
    Work: ["Assign", "Report", "Meeting"],
    Friend: ["Help", "Plan", "Hangout"],
    Client: ["Proposal", "Feedback", "Update"]
  };

  // Replies dataset (6 per situation)
  const repliesData = {
    Work: {
      Assign: ["Please take this up now","I assigned this yesterday","You'll handle this tomorrow","This task is yours today","You managed this last week","You'll be responsible next time"],
      Report: ["Submit the report today","You submitted last quarter","You'll submit next week","Send the file now","You shared it earlier","You'll deliver it soon"],
      Meeting: ["Join the meeting now","You attended yesterday","You'll attend tomorrow","Be present today","You joined last time","You'll connect next session"]
    },
    Friend: {
      Help: ["Can you help me now?","You helped me last time","You'll help me tomorrow","Support me today","You backed me before","You'll assist later"],
      Plan: ["Let's plan it now","We planned yesterday","We'll plan tomorrow","Sort details today","We arranged earlier","We'll figure it out soon"],
      Hangout: ["Let's hang out today","We hung out last week","We'll hang out next time","Meet me now","We met before","We'll meet later"]
    },
    Client: {
      Proposal: ["Share the proposal now","You shared last quarter","You'll share next week","Present it today","You presented earlier","You'll present soon"],
      Feedback: ["Provide feedback today","You gave feedback before","You'll give feedback tomorrow","Respond now","You responded last time","You'll respond later"],
      Update: ["Provide the update now","You reported last week","You'll report tomorrow","Share progress today","You informed me earlier","You'll keep me informed later"]
    }
  };

  // Audience selection
  audienceButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (selectedAudience) return;
      selectedAudience = btn.dataset.value;
      audienceButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderSituations();
    });
  });

  // Render situations dynamically
  function renderSituations() {
    const container = document.getElementById("situations");
    const situations = situationMap[selectedAudience];
    container.innerHTML = situations
      .map(s => `<button class="situation-btn" data-value="${s}">${s}</button>`)
      .join("");
    document.querySelectorAll(".situation-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        if (selectedSituation) return;
        selectedSituation = btn.dataset.value;
        document.querySelectorAll(".situation-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        showReplies();
      });
    });
  }

  // Show replies (3 at a time, rotate on reset)
  function showReplies() {
    if (!selectedAudience || !selectedSituation) return;
    const key = `${selectedAudience}-${selectedSituation}`;
    if (!replyIndex[key]) replyIndex[key] = 0;
    const replies = repliesData[selectedAudience][selectedSituation];
    const start = replyIndex[key] * 3;
    const selected = replies.slice(start, start + 3);
    repliesDiv.innerHTML = selected
      .map(r => `<div class="reply" onclick="navigator.clipboard.writeText('${r}')">${r}</div>`)
      .join("");
  }

  // Reset everything and rotate replies
  resetBtn.addEventListener("click", () => {
    if (!selectedAudience || !selectedSituation) return;
    const key = `${selectedAudience}-${selectedSituation}`;
    replyIndex[key] = (replyIndex[key] + 1) % 2;
    selectedAudience = null;
    selectedSituation = null;
    audienceButtons.forEach(b => b.classList.remove("active"));
    document.getElementById("situations").innerHTML = "";
    repliesDiv.innerHTML = "";
  });

  // Email capture
  botCheck.addEventListener("change", () => {
    notifyBtn.disabled = !botCheck.checked;
  });
  notifyBtn.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (!email.includes("@")) {
      message.textContent = "Enter a valid email.";
      return;
    }
    message.textContent = "We will notify you.";
    emailInput.value = "";
    botCheck.checked = false;
    notifyBtn.disabled = true;
  });

  // Parallax background effect
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    document.body.style.backgroundPosition = `center ${scrollY * 0.3}px`;
  });
});
