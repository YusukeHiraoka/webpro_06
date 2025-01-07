const API_BASE_URL = "http://localhost:8080/recipes"; // APIのURLを変更

// レシピを追加
document.getElementById("addRecipeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const ingredients = document.getElementById("ingredients").value.split(",");
  const instructions = document.getElementById("instructions").value;

  try {
    const response = await fetch(`${API_BASE_URL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, ingredients, instructions }),
    });

    const result = await response.json();
    alert(result.message || "エラーが発生しました");
    loadRecipes();
  } catch (error) {
    console.error("エラー:", error);
    alert("エラーが発生しました。もう一度お試しください。");
  }
});

// レシピを検索
document.getElementById("searchButton").addEventListener("click", async () => {
  const keyword = document.getElementById("searchKeyword").value;

  try {
    const response = await fetch(`${API_BASE_URL}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword }),
    });

    const result = await response.json();
    displayRecipes(result.recipes || []);
  } catch (error) {
    console.error("エラー:", error);
    alert("検索中にエラーが発生しました。");
  }
});

// レシピを表示
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach((recipe) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${recipe.title}</strong>
      <p>材料: ${recipe.ingredients.join(", ")}</p>
      <p>作り方: ${recipe.instructions}</p>
      <button class="deleteButton" data-title="${recipe.title}">削除</button>
    `;
    recipeList.appendChild(li);
  });

  document.querySelectorAll(".deleteButton").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const title = e.target.getAttribute("data-title");

      try {
        const response = await fetch(`${API_BASE_URL}/delete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        });

        const result = await response.json();
        alert(result.message || "エラーが発生しました");
        loadRecipes();
      } catch (error) {
        console.error("エラー:", error);
        alert("削除中にエラーが発生しました。");
      }
    });
  });
}

// レシピを全てロード
async function loadRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword: "" }),
    });

    const result = await response.json();
    displayRecipes(result.recipes || []);
  } catch (error) {
    console.error("エラー:", error);
    alert("レシピのロード中にエラーが発生しました。");
  }
}

// 初期ロード
loadRecipes();
