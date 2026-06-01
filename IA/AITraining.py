import torch
import torch.nn as nn
import torch.optim as optim
import pandas as pd
from torch.utils.data import DataLoader, TensorDataset

# 1. Carregamento de dados
df = pd.DataFrame(pd.read_csv('dataset_kineo_pro.csv'))

X = df[['carga_atual', 'dias_treinados', 'meta_reps', 'reps_feitas', 'falhas_consecutivas']].values
y = df[['proxima_carga']].values

X_tensor = torch.tensor(X, dtype=torch.float32)
y_tensor = torch.tensor(y, dtype=torch.float32)

dataset = TensorDataset(X_tensor, y_tensor)
loader = DataLoader(dataset, batch_size=64, shuffle=True)

# 2. Arquitetura da Rede Neural
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
criterio = nn.MSELoss()
otimizador = optim.AdamW(modelo.parameters(), lr=0.001)

# 3. Treino
print("Iniciando treinamento...")
epochs = 200
for epoch in range(epochs):
    loss_total = 0
    for lote_X, lote_y in loader:
        otimizador.zero_grad()
        previsoes = modelo(lote_X)
        erro = criterio(previsoes, lote_y)
        erro.backward()
        otimizador.step()
        loss_total += erro.item()
        
    if (epoch+1) % 20 == 0:
        print(f'Época {epoch+1}/{epochs} | Erro Médio: {loss_total/len(loader):.4f}')

torch.save(modelo.state_dict(), 'modelo_kineo_pro.pth')
print("Treinamento concluído!")