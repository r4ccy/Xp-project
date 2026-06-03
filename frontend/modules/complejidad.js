class ComplexityAnalyzer {

  constructor() {
    this.functions = [];
    this.editingId = null;
  }

  async init() {
    this.setupEvents();
    await this.loadFunctions();
  }

  setupEvents() {
    const btn = document.querySelector(".btn-analyze");
    if (btn) {
      btn.addEventListener("click", () => this.registerFunction());
    }
  }

  async loadFunctions() {
    try {
      const response = await fetch("http://localhost:3000/api/functions");
      this.functions = await response.json();
      this.renderFunctions();
    } catch (error) {
      console.error(error);
    }
  }

  async registerFunction() {
    const nameInput = document.getElementById("functionName");
    const contentInput = document.getElementById("functionContent");
    const name = nameInput.value.trim();
    const content = contentInput.value.trim();

    if (!name || !content) {
      alert("Completa todos los campos");
      return;
    }

    try {
      let response;

      if (this.editingId !== null) {
        // modo edición → PUT
        response = await fetch(
          `http://localhost:3000/api/functions/${this.editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
          }
        );
      } else {
        // modo creación → POST
        response = await fetch(
          "http://localhost:3000/api/functions",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, content })
          }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar función");
      }

      document.getElementById("currentComplexity").textContent =
        data.complexity || "Pendiente";

      // reset
      this.editingId = null;
      nameInput.value = "";
      nameInput.disabled = false;
      contentInput.value = "";

      document.querySelector(".btn-analyze").textContent = "Analizar función";

      await this.loadFunctions();

    } catch (error) {
      alert(error.message);
    }
  }

  editFunction(id, name, content) {
    this.editingId = id;
    const nameInput = document.getElementById("functionName");
    nameInput.value = name;
    nameInput.disabled = true;
    document.getElementById("functionContent").value = content;
    document.querySelector(".btn-analyze").textContent = "Guardar cambios";
    // scroll al formulario
    document.querySelector(".hu2-panel").scrollIntoView({ behavior: "smooth" });
  }

  renderFunctions() {
    const container = document.getElementById("functionsContainer");
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
            <span class="complexity-tag">${func.complexity || "Pendiente"}</span>
            <button
              class="btn-mini"
              onclick="complexityAnalyzer.editFunction(${func.id}, '${func.name}', \`${func.content}\`)">
              Editar
            </button>
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
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Error al eliminar función");
      await this.loadFunctions();
    } catch (error) {
      alert(error.message);
    }
  }
}

const complexityAnalyzer = new ComplexityAnalyzer();
document.addEventListener("DOMContentLoaded", () => complexityAnalyzer.init());