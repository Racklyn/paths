
const size = 20

module.exports = {

    getMenorTrajeto(graph, inicio, fim){
        // Lista que indica quantas vezes no máx. cada node pode ser visto
        let maxVis = {}
        
        //distância a partir do início(A)
        let distances={}
        Object.keys(graph).forEach((k)=>{
            distances[k]=-1
            Object.keys(graph[k]).forEach((adj)=>{
                if(adj in maxVis){
                    maxVis[adj]+=1
                }else{
                    maxVis[adj]=1
                }
            })
                
        })
            
        let queue = [] //fila dos próximos a visitar

        //Reduz a execução --------
        //o ponto de início não será visitados mais de uma vez
        maxVis[inicio]=1
        //chegando no END, não iremos p/ nenhum outro node, mesmo que END tivesse adjacentes
        //graph[fim]={}
        //-------

        queue.push(inicio) //vai começar pelo A / START POINT
        distances[inicio]=0
        let passos = 0

        let trajetos = [[inicio]] //lista com os pontos até o final

        //console.log("maxVis: "+maxVis)

        while (queue.length>0){
            console.log(queue)
            console.log(distances)
            let curr = queue.splice(0,1) //tirando o primeiro da lista / atual
            passos+=1
            // uma vez a mennos foi visitado
            maxVis[curr]-=1


            if(curr!=fim){ //não vai percorrer os adjs do FIM
                //percorrendo os adjacentes do atual
                Object.keys(graph[curr]).forEach((adjacent)=>{
                    if (maxVis[adjacent]>0){//ainda pode ser visitado
                        queue.push(adjacent) 
                    }
    
                    //adicionar distância
                    let newDist = distances[curr]+graph[curr][adjacent]
                    if(distances[adjacent]==-1 || newDist<distances[adjacent]){
                        distances[adjacent]=newDist
                    }
    
    
                    //adicionar trajeto
                    var trajAux = trajetos
                    trajetos.forEach((t,i)=>{
                        if(t[t.length-1]==curr){
                            trajAux.push([...trajAux[i],adjacent])
                        }
                    })
                    trajetos = trajAux
                    //console.log("traj: " + trajetos)
    
                })
    
            }
            
        }    
        
        
        //CRIANDO TRAJETO___________

        trajetos = trajetos.filter((t)=>t[t.length-1]==fim) //só os que terminam no FIM
        let menorTrajeto = []
        if(trajetos.length>0){
            menorTrajeto = trajetos[0]
            trajetos.forEach((t)=>{
                var dist = 0
                for(var i=0; i<t.length-1; i++){
                    dist += graph[t[i]][t[i+1]]
                    if(dist==distances[fim]){
                        menorTrajeto = t
                        break
                    }
                }
            })
            //menorTrajeto = menorTrajeto.join('')
        }
        
                           
    

        var dist = -1
        if(distances[fim]!=-1){
            dist = distances[fim]+(menorTrajeto.length-2)*2*size
        }

        return {"menorDistancia": dist,
                "trajeto": menorTrajeto
            }
    }
    /**
     ''' Busca por largura (BFS) '''
#Menor distância grafo com PESOS

graph = {
    'A': {'B':10,'C':1},
    'B': {'C':1},
    'C': {'A':1,'D':1},
    'D': {'A':1,'F':1},
    'E': {'B':1},
    'F': {'C':1,'E':2},
    }

#Lista que indica quantas vezes no máx. cada node
#...pode ser visitado
maxVis = {}

# distância a partir do início(A)
distances={}
for k in graph.keys():
    distances[k]=-1
    for adj in graph[k].keys():
        if(adj in maxVis):
            maxVis[adj]+=1
        else:
            maxVis[adj]=1


queue = [] #fila dos próximos a visitar

#só pra mostrar na tela
start = 'A'
end = 'B'

''' reduz a execução --------'''
#o ponto de início não será visitados mais de uma vez
maxVis[start]=1
#chegando no END, não iremos p/ nenhum outro node, mesmo
#...que END tivesse adjacentes
graph[end]={}
'''--------------------------'''

queue.append(start) #vai começar pelo A / START POINT

distances[start]=0
passos = 0

print(maxVis)
while len(queue)>0:
    print(queue)
    print(distances)
    curr = queue.pop(0) #tirando o primeiro da lista / atual

    passos+=1
    # uma vez a mennos foi visitado
    maxVis[curr]-=1

    #percorrendo os adjacentes do atual
    for adjacent in graph[curr].keys():
        if maxVis[adjacent]>0:#ainda pode ser visitado
            queue.append(adjacent)
            
            
        #adicionar distância
        newDist = distances[curr]+graph[curr][adjacent]
        if(distances[adjacent]==-1 or newDist<distances[adjacent]):
           distances[adjacent]=newDist
        
        
            

print("FIM!")
print("Menor distância de %s a %s: %s"
%(start,end,(str(distances[end]) if distances[end]!=-1 else "Impossível")))
print("passos:",passos)

     */

}
