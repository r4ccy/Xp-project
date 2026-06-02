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

      this.functions =
        await FunctionService.getAll();

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

      await FunctionService.create({
        name,
        content
      });

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

      await FunctionService.delete(id);

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