import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import {usePrevious} from './usePrevious';
//import { _ } from 'lodash'
//const _ = require('lodash');

import {GiCancel} from 'react-icons/gi'
import {FcRuler} from 'react-icons/fc'
import {FaMapSigns} from 'react-icons/fa'
import {RiPinDistanceLine} from 'react-icons/ri'

//import { FcTreeStructure } from "react-icons/fc";
import RoutesImg from './assets/routes.png'
import './App.css';
import calculoDeRota from './calculoDeRota';

function App() {


  const [nodes,setNodes] = useState({
    1: {x: 100, y: 100, color: "rgb(151,70,114)"},
    2: {x: 700, y: 300, color: "rgb(25,114,211)"},
    3: {x: 700, y: 100, color: "rgb(25,114,211)"},
    4: {x: 800, y: 200, color: "rgb(25,114,211)"},
    5: {x: 750, y: 300, color: "rgb(250,80,200)"},
    6: {x: 700, y: 400, color: "rgb(0,80,200)"}
  })

  const [paths, setPaths] = useState({
    1: {2: 592.4555320336759},2:{},
    2: {3: 121.9876538505327, 5:10, 6:60},
    3: {4: 95.02962637880623},
    4: {},
    5: {},
    6: {}
  })




  //para a rota a ser criada:
  const [inicioRota,setInicioRota] = useState(0)
  const [fimRota,setFimRota] = useState(0)

  const [menorDistancia, setMenorDistancia] = useState(0)
  const [trajeto,setTrajeto] = useState([])

  //TESTE
  const [estado,setEstado] = useState(false)

  const ctxRef = useRef(null)

  //pontos para ligar---
  const [ponto1,setPonto1] = useState(0)
  const [ponto2,setPonto2] = useState(0)

  const [direcao,setDirecao] = useState('right')
  //-------
  

  const [nToDelete,setNToDelete] = useState(0)

  const canvasRef = useRef(null)

  const size = 20

  //tema
  const [tema,setTema] = useState(false) //tema padrão FALSE

  
//--------AO INICIAR-------------
  useEffect(()=>{

    const canvasObj = canvasRef.current
    /*canvasObj.width = window.innerWidth - 302
    console.log(window.innerWidth)
    console.log(window.innerHeight)
    canvasObj.heigth = (window.innerHeight - 72)/2
    canvasObj.style.width =`${window.innerWidth - 302}px`
    canvasObj.style.heigth =`${(window.innerHeight - 72)/2}px`
    */

    const ctx = canvasObj.getContext("2d")
    let escala = (window.innerWidth - 300)/1000
    ctx.scale(escala,escala)
    ctxRef.current = ctx
    
    draw()

    //ctx.fillStyle = 'red'
    //ctx.fillRect(50,20,20,20)
  },[])


  function draw(){
    //limpando
    ctxRef.current.fillStyle = tema?"#EEE":"#181c22";
    ctxRef.current.fillRect(0,0,1000, 500);

    var trajetoTxt = "."+trajeto.join('.')+"."
    //console.log(trajetoTxt)

    for(var c in nodes){
      //linha entre pontos*********************
      for(var p in paths[c]){
        //console.log(paths)
        //console.log(p)
         //linnha entre pontos*********************
        ctxRef.current.lineWidth = size/4; //largura da linha
        if(trajetoTxt.includes(`.${c}.${p}.`) || trajetoTxt.includes(`.${p}.${c}.`)){
          ctxRef.current.strokeStyle = '#E33'; //cor da linha
        }else{
          ctxRef.current.strokeStyle = '#cb9'; //cor da linha
        }
        
        ctxRef.current.beginPath()
        ctxRef.current.moveTo(nodes[c].x,nodes[c].y)
        ctxRef.current.lineTo(nodes[p].x,nodes[p].y)
        ctxRef.current.stroke()
      }
    }


    for(var c in nodes){  
      for(var p in paths[c]){

        //Setas apontando---------------
         //distância entre 1 e 2
        let d12 =  Math.sqrt((nodes[p].y-nodes[c].y)**2 + (nodes[p].x-nodes[c].x)**2)

        let h = (nodes[p].y-nodes[c].y)/d12 //oposto sobre hip. SENO
        let b = (nodes[p].x-nodes[c].x)/d12
        
        let s = size
        //SETA
        if(trajetoTxt.includes(`.${c}.${p}.`)){
          ctxRef.current.fillStyle = "red"; //cor da seta
          s=size*1.5
        }else{
          ctxRef.current.fillStyle = "#848E"; //cor da seta
        }

        //pequeno triângulo do centro do ponto até a ponta da seta::
        let h1 = h * s
        let b1 = b * s

        let yp = nodes[p].y - h * size //y da ponta da seta
        let xp = nodes[p].x - b * size //x da ponta da seta

        //coordenadas do ponto C: centro da base da seta
        let cy = yp - h1
        let cx = xp - b1 

        
        ///EDITAR DAQUI PRA BAIXO>>>>>>>>>>>>>>>>

        //coordenadas ponto A da seta
        let pAx = cx + h1/2
        let pAy = cy - b1/2

        //coordenadas ponto B da seta
        let pBx = cx - h1/2
        let pBy = cy + b1/2

        //<<<<<<<<<<<< EDITAR DAQUI PRA CIMA<<<<<<



        ctxRef.current.beginPath()
        ctxRef.current.moveTo(xp,yp); //ponta

        ctxRef.current.lineTo(pAx,pAy);
        ctxRef.current.lineTo(pBx,pBy);
        ctxRef.current.fill();

        /*
        //ponto C
        var circle = new Path2D();
          //circle.moveTo(20, 20);
          ctxRef.current.fillStyle = "red"
          circle.arc(cx, cy, 2, 0, 2 * Math.PI);
          ctxRef.current.fill(circle);
        //ponto A
        var circle = new Path2D();
          //circle.moveTo(20, 20);
          ctxRef.current.fillStyle = "blue"
          circle.arc(pAx, pAy, 2, 0, 2 * Math.PI);
          ctxRef.current.fill(circle);   
        //ponto B
        var circle = new Path2D();
        //circle.moveTo(20, 20);
        ctxRef.current.fillStyle = "purple"
        circle.arc(pBx, pBy, 2, 0, 2 * Math.PI);
        ctxRef.current.fill(circle);*/

        //------------ setas
      }
      //****************************** */


      var circle = new Path2D();
      //circle.moveTo(20, 20);
      ctxRef.current.fillStyle = nodes[c].color
      circle.arc(nodes[c].x, nodes[c].y, size, 0, 2 * Math.PI);
      ctxRef.current.fill(circle);

      ctxRef.current.fillStyle = "#FFF";
      ctxRef.current.font = `${size}px Century`;
      ctxRef.current.fillText(`${c.length>1?c:"0"+c}`,nodes[c].x-(size/2),nodes[c].y+(size/4));
    }

   

  }


  function clicando(e){
    setEstado(!estado)
    clickOnCanvas(e)
  }

  useEffect(()=>{
    //console.log("PATHS: ")
    //console.log(paths)
    draw()
  },[estado])


  //ADD CIRCLE---------------------------------
  function clickOnCanvas(event){
    var rect = canvasRef.current.getBoundingClientRect();
    var xRel = Math.round((event.clientX - rect.left  )/((window.innerWidth- 300)/1000))
    var yRel = Math.round((event.clientY - rect.top)/((window.innerWidth- 300)/1000))
    //console.log("relativo X: "+ xRel)
    //console.log(`X: ${event.clientX - rect.left}`)
    //console.log(`Y: ${event.clientY - rect.top}`)
    //console.log(`Y: ${offSetY}`)

    let r = Math.floor(Math.random()*256)
    let g = Math.floor(Math.random()*256)
    let b = Math.floor(Math.random()*256)

    let name = 1
    if(Object.keys(nodes).length>0){
      name = Number(Object.keys(nodes)[Object.keys(nodes).length-1])+1
    }
    addCircle(name.toString(),xRel,yRel,`rgb(${r},${g},${b})`)
    
    draw()
  }

  function addCircle(name,x,y,color){
  
    setNodes(p =>{
      let novo = p
      novo[name] = {x:x,y:y,color:color}
      return novo
    })

    setPaths(p =>{
      let novo = p
      novo[name] = {}
      return novo
    })
    console.log(nodes)
  }

  function deleteNode(e){
    e.preventDefault()
    if(nodes.hasOwnProperty(nToDelete.toString())){
      setNodes(p =>{
        let novo = p
        delete novo[nToDelete]
        return novo
        })

      //Deletando paths com o node:
      setPaths(p=>{
        var novoP = p
        var n = nToDelete.toString()
        if(novoP.hasOwnProperty(n)){
          delete novoP[n]
        }
        Object.keys(p).forEach((ob)=>{
          if(p[ob].hasOwnProperty(n)){
            delete novoP[ob][n]
          }
        })
        return novoP
      })

      setEstado(!estado)
      //setNToDelete(0)
      limparRota()

    }else{
      //console.log("Oi")
      alert(`Ponto ${nToDelete} não existe!`)
    }
    
  }

  function ligarPontos(e){
    e.preventDefault()
    if(nodes.hasOwnProperty(ponto1) && nodes.hasOwnProperty(ponto2)){
      //distância entre os pontos
      let dist = (Math.sqrt((nodes[ponto1].y-nodes[ponto2].y)**2 + (nodes[ponto1].x-nodes[ponto2].x)**2))-2*size
      setPaths(p =>{
        let novo = p
        if(dist<0)dist=0
        if(direcao==="right" || direcao==="both"){
          let lig = novo[ponto1]
          lig[ponto2] =  dist
          novo[ponto1] = lig
        }
        if(direcao==="left" || direcao==="both"){
          let lig = novo[ponto2]
          lig[ponto1] =  dist
          novo[ponto2] = lig
        }
        
        return novo
      })
      console.log(paths )
      setEstado(!estado)
      //alert(`A distância entre ${ponto1} e ${ponto2} é: ${dist} pixels`)
    }else{
      alert(`Algum dos pontos não existe\n Impossível criar rota ${ponto1}-${ponto2}!`)
    }
    
  }

  function calcularRota(e){
    e.preventDefault()
    if(nodes.hasOwnProperty(inicioRota) && nodes.hasOwnProperty(fimRota)){
      var rota = calculoDeRota.getMenorTrajeto(paths, inicioRota, fimRota)
      setMenorDistancia(rota.menorDistancia)
      setTrajeto(rota.trajeto)
      setEstado(!estado)
    }else{
      alert(`Alguns dos pontos inseridos (${inicioRota} ou ${fimRota}) não exite!`)
    }
    
  }

  function limparRota(){
    setMenorDistancia(0)
    setTrajeto([])
    setEstado(!estado)
  }

  const [colorText,setColorText] = useState("#333")

  function mudarTema(){
    //alert(`Tema alterado para: ${!tema?"REVERSO":"PADRÃO"}!`)
    setColorText(!tema?"#CCC":"#333")
    setTema(!tema)
    setEstado(!estado)
  }


  return (
    <div className="App">
      <header style={{backgroundColor:`${tema?"#181c22":"#EEE"}`}}>
        <h1 style={{color:`${tema?"#CCC":"#333"}`}}>PATHS</h1>
        <img src={RoutesImg} alt="img" height="40"/>
        <button id="btn-tema" className="button" onClick={e=>mudarTema()}>Tema</button>
      </header>
      <main style={{backgroundColor:`${tema?"#282732":"#EEE"}`}}>
        <canvas
          onClick = {clicando}
          width = {(window.innerWidth - 300)}
          height = {(window.innerWidth - 300)/2}
          ref={canvasRef}
        />
        <div className="menu"  style={{backgroundColor:`${tema?"#181c22":"#EEE"}`}}>
          <form className="form-ligar" onSubmit={ligarPontos}>
            <hr/>
            <h3 style={{color:colorText}}>Ligar pontos:</h3>
            <div>
              <input
                placeholder="De"
                type="number"
                onChange = {e=>setPonto1(e.target.value)}
              />
              <select id="direcao" onChange={(e)=>{setDirecao(e.target.value)}}>
                <option value="right">→</option>
                <option value="both">⇄</option>
                <option value="left">←</option>
              </select>
              <input
                placeholder="Para"
                type="number"
                onChange = {e=>setPonto2(e.target.value)}
              />
            </div>
            <button className="button" type="submit">Conectar</button>
          </form>

          <form className="form-rota" onSubmit={calcularRota}>
            <hr/>
            <h3 style={{color:colorText}}> <FaMapSigns/> Rota:</h3>
            <div>
              <input
                placeholder="De"
                type="number"
                onChange = {e=>setInicioRota(e.target.value)}
              />
              <input
                placeholder="Para"
                type="number"
                onChange = {e=>setFimRota(e.target.value)}
              />
              <button className="button" type="submit">Ir</button>
            </div>
            <div className = "info-rota">
              <p style={{color:colorText}}> <FcRuler size={18} /> <b>Menor distância: </b> 
                {menorDistancia==-1?"Impossível":menorDistancia.toFixed(2)+ " Px"}</p>
              <p style={{color:colorText}}> <RiPinDistanceLine color="black" size={18} /> <b>Trajeto: </b>{trajeto.length>0?trajeto.join("-"):"-"}</p>
            </div>
            <button id="btn-limpar" className="button" type="reset" onClick={e=>limparRota(e)}>
                Limpar <GiCancel color="#F11" size={20}/>
              </button>
          </form>

          <form className="form-delete" onSubmit={e=>deleteNode(e)}>
            <hr/>
            <h3 style={{color:colorText}}>Deletar ponto:</h3>
            <div>
              <input
                placeholder="n°"
                type="number"
                onChange = {e=>setNToDelete(e.target.value)}
                //value={nToDelete}
              />
              <button className="button" type="reset">Deletar</button>
            </div>     
          </form>


        </div>
    
      </main>
    </div>
      
  );
}

export default App;
