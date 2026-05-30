let grupoSelecionado = null;
let timerBusca = null;

// Função auxiliar para pegar o token
function getToken() {
    const usuarioStorage = localStorage.getItem("usuarioLogado");
    if (usuarioStorage) {
        const usuario = JSON.parse(usuarioStorage);
        return usuario.token;
    }
    return null;
}


function mapearNomeDoGrupo(grupoFrontEnd) {
    const mapa = {
        "peito": "peito",
        "costas": "costas", 
        "ombro": "ombro",
        "pernas": "quadriceps",
        "biceps": "biceps",
        "triceps": "triceps",
        "abdomen": "abdominais" 
    };
    return mapa[grupoFrontEnd] || grupoFrontEnd;
}

window.onload = () => {
    const inputBusca = document.getElementById("input-busca");

    if(inputBusca) {
        inputBusca.addEventListener("input", () => {
            clearTimeout(timerBusca);
            
            timerBusca = setTimeout(() => {
                const textoBusca = inputBusca.value.trim().toLowerCase();
                
                if (textoBusca.length > 0) {
                    grupoSelecionado = null; 
                    atualizarMenuAtivo(null);
                    buscarExerciciosPorPesquisa(textoBusca);
                } else if (grupoSelecionado) {
                    buscarPorGrupo(grupoSelecionado);
                } else {
                    filtrarGrupo("peito"); 
                }
            }, 500); 
        });
    }

    filtrarGrupo("peito");
};

async function filtrarGrupo(grupo) {
    const inputBusca = document.getElementById("input-busca");
    if(inputBusca) inputBusca.value = ""; 
    
    if (grupoSelecionado === grupo) {
        grupoSelecionado = null;
        renderizarExercicios([]);
    } else {
        grupoSelecionado = grupo;
        await buscarPorGrupo(grupo);
    }

    atualizarMenuAtivo(grupoSelecionado);
}

async function buscarPorGrupo(grupo) {
    const token = getToken();
    if (!token) return;

    const grupoCorrigido = mapearNomeDoGrupo(grupo);

    try {
        const response = await fetch(`http://localhost:8080/api/exercises/categoria/${grupoCorrigido}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const dados = await response.json();
            renderizarExercicios(dados);
        }
    } catch (error) {
        console.error("Erro ao buscar categoria:", error);
    }
}

async function buscarExerciciosPorPesquisa(termo) {
    const token = getToken();
    if (!token) return;

    try {
        const response = await fetch(`http://localhost:8080/api/exercises/buscar?q=${termo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const dados = await response.json();
            renderizarExercicios(dados);
        }
    } catch (error) {
        console.error("Erro ao pesquisar:", error);
    }
}

function atualizarMenuAtivo(grupo) {
    const links = document.querySelectorAll(".filtro a");
    links.forEach(link => {
        link.classList.remove("ativo");
        if (link.dataset.grupo === grupo) {
            link.classList.add("ativo");
        }
    });
}

function renderizarExercicios(lista) {
    const container = document.getElementById("lista-exercicios");
    container.innerHTML = "";

    if (!lista || lista.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px; color:#888; font-family: 'Baloo Thambi 2', sans-serif;">
                <h3 style="font-family: 'Russo One', sans-serif; font-weight: normal;">Nenhum exercício encontrado.</h3>
                <p style="font-size: 18px;">Selecione uma categoria acima ou digite na barra de pesquisa.</p>
            </div>`;
        return;
    }

    lista.forEach(exercicio => {
        const card = document.createElement("div");
        card.classList.add("container-exercicio");
        
        card.style.padding = "25px";
        card.style.marginBottom = "20px";
        card.style.background = "#1e1e24";
        card.style.borderRadius = "12px";

        const nome = exercicio.nome || "Exercício sem nome";
        const equipamento = exercicio.equipamentos || "Nenhum";
        const nivel = exercicio.nivelDificuldade || "Geral";
        const musculos = exercicio.grupoMuscular || "Não classificado";
        const descricao = exercicio.descricao || "Sem descrição disponível.";

    
        card.innerHTML = `
        <div class="card-header" style="border-bottom: 2px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="font-family: 'Russo One', sans-serif; color: #fff; text-transform: capitalize; font-size: 22px; margin: 0; letter-spacing: 1px;">
                ${nome}
            </h2>
        </div>
        
        <div class="card-body" style="display: flex; gap: 20px; flex-wrap: wrap; font-family: 'Baloo Thambi 2', sans-serif; color: #ddd;">
            
            <div style="flex: 2; min-width: 300px; background: rgba(255,255,255,0.03); padding: 20px; border-radius: 8px;">
                <h3 style="font-family: 'Russo One', sans-serif; color: #6c63ff; font-size: 16px; font-weight: normal; margin-top: 0; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Instruções de execução
                </h3>
                <p style="font-size: 16px; line-height: 1.7; text-align: justify; margin: 0;">
                    ${descricao}
                </p>
            </div>

            <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 12px;">
                
                <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; display: flex; flex-direction: column;">
                    <span style="font-family: 'Russo One', sans-serif; color: #6c63ff; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">Equipamento</span>
                    <span style="font-size: 18px; text-transform: capitalize; color: #fff;">${equipamento.replace(/-/g, " ")}</span>
                </div>

                <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; display: flex; flex-direction: column;">
                    <span style="font-family: 'Russo One', sans-serif; color: #6c63ff; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">Nível de Dificuldade</span>
                    <span style="font-size: 18px; text-transform: capitalize; color: #fff;">${nivel}</span>
                </div>

                <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 8px; display: flex; flex-direction: column;">
                    <span style="font-family: 'Russo One', sans-serif; color: #6c63ff; font-size: 13px; text-transform: uppercase; margin-bottom: 4px;">Músculos Alvo</span>
                    <span style="font-size: 18px; text-transform: capitalize; color: #a78bfa; font-weight: bold;">${musculos}</span>
                </div>

            </div>
        </div>
        `;

        container.appendChild(card);
    });
}