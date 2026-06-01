from fastapi import FastAPI
from pydantic import BaseModel
import torch
import torch.nn as nn

app = FastAPI()

class DadosTreino(BaseModel):
    carga_atual: float
    dias_treinados: int 
    meta_reps: int
    reps_feitas: int
    falhas_consecutivas: int 

class KineoProAI(nn.Module):
    def __init__(self):
        super(KineoProAI, self).__init__()
        self.camada1 = nn.Linear(5, 64) 
        self.relu1 = nn.ReLU()
        self.camada2 = nn.Linear(64, 64)
        self.relu2 = nn.ReLU()
        self.camada3 = nn.Linear(64, 32)
        self.relu3 = nn.ReLU()
        self.saida = nn.Linear(32, 1)

    def forward(self, x):
        x = self.relu1(self.camada1(x))
        x = self.relu2(self.camada2(x))
        x = self.relu3(self.camada3(x))
        return self.saida(x)

modelo = KineoProAI()
try:
    modelo.load_state_dict(torch.load('modelo_kineo_pro.pth', weights_only=True))
    modelo.eval()
    print("Modelo carregado com sucesso!")
except FileNotFoundError:
    print("ATENÇÃO: 'modelo_kineo_pro.pth' não encontrado.")

@app.post("/prever")
def prever_evolucao(dados: DadosTreino):
    entrada_tensor = torch.tensor([[
        dados.carga_atual, 
        float(dados.dias_treinados), 
        float(dados.meta_reps), 
        float(dados.reps_feitas),
        float(dados.falhas_consecutivas) 
    ]])
    
    with torch.no_grad():
        previsao_tensor = modelo(entrada_tensor)
        
    nova_carga_matematica = previsao_tensor.item()
    passo_academia = 2.0 
    carga_realista = round(nova_carga_matematica / passo_academia) * passo_academia
    
    if carga_realista < 5.0:
        carga_realista = 5.0
        
    return {
        "mensagem": "Previsão calculada com sucesso!",
        "carga_recomendada": carga_realista
    }