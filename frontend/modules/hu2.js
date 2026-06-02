class ComplexityAnalyzer {

  constructor() {
    this.functions = [];
  }

  async init() {

    this.setupEvents();

    await this.loadFunctions();
  }

  setupEvents() {

    const btn =
      document.querySelector(".btn-analyze");

    if (btn) {
      btn.addEventListener(
        "click",
        () => this.registerFunction()
      );
    }
  }

  async loadFunctions() {

    try {

      const response = await fetch(
        "http://localhost:3000/api/functions"
      );

      this.functions =
        await response.json();

      this.renderFunctions();

    } catch (error) {

      console.error(error);
    }
  }

  async registerFunction() {

    const name =
      document
        .getElementById("functionName")
        .value
        .trim();

    const content =
      document
        .getElementById("functionContent")
        .value
        .trim();

    if (!name || !content) {
      alert("Completa todos los campos");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:3000/api/functions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            content
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
          "Error al registrar función"
        );
      }

      document.getElementById(
      "currentComplexity"
        ).textContent =
        data.complexity || "Pendiente";

        await this.loadFunctions();

      await this.loadFunctions();

      document.getElementById(
        "functionName"
      ).value = "";

      document.getElementById(
        "functionContent"
      ).value = "";

    } catch (error) {

      alert(error.message);
    }
  }

  renderFunctions() {

    const container =
      document.getElementById(
        "functionsContainer"
      );

    if (!container) return;

    container.innerHTML = "";

    this.functions.forEach(func => {

      container.innerHTML += `
        <div class="function-row">

          <div class="function-info">
            <span class="function-dot"></span>
            <strong>${func.name}</strong>
          </div>

          <div class="function-actions">

            <span class="complexity-tag">
              ${func.complexity || "Pendiente"}
            </span>

            <button
              class="btn-mini danger"
              onclick="complexityAnalyzer.deleteFunction(${func.id})">
              Eliminar
            </button>

          </div>

        </div>
      `;
    });
  }

  async deleteFunction(id) {

    try {

      const response = await fetch(
        `http://localhost:3000/api/functions/${id}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error al eliminar función"
        );
      }

      await this.loadFunctions();

    } catch (error) {

      alert(error.message);
    }
  }
}

const complexityAnalyzer =
  new ComplexityAnalyzer();

document.addEventListener(
  "DOMContentLoaded",
  () => complexityAnalyzer.init()
);