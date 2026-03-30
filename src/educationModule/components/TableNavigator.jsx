import React from 'react'
import './styles/tableNavigator.css'


export const TableNavigator = ({totalPages = 1, currentPage = 1, onSetNewPage = () => {}}) => {

  const maxButton = 15 //esto lo podemos cambiar para modificar la cantidad maxima de botones de pagina
  const maxButtonLR = Math.trunc(maxButton/2);

  const navigator = [];
  navigator.push(<div key={-10} className="navigator-text">{`Página ${currentPage} de ${totalPages} -`}</div>);
  
  if ((totalPages <= maxButton+1)){
    //la vista es izquierda caso 1 (sin boton para el final)
    for(let i=1;i<=totalPages;i++){
      navigator.push(<button key={i} onClick={() => {onSetNewPage(i)}} className={`navigator-button ${(i===currentPage ? 'selected-page' : null)}`}>{i}</button>);
    }
    return (<div className="navigator-container">{navigator}</div>);
  }

  if((currentPage<(maxButtonLR+3))){
    //la vista es izquierda caso 2 (cin boton para el final)
    for(let i=1;i<=maxButton;i++){
      navigator.push(<button key={i} onClick={() => {onSetNewPage(i)}} className={`navigator-button ${(i===currentPage ? 'selected-page' : null)}`}>{i}</button>);
    }
    navigator.push(<div key={-1} className='navigator-text'>...</div>);
    navigator.push(<button key={0} onClick={() => {onSetNewPage(totalPages)}} className='navigator-button'>{totalPages}</button>);
    return (<div className="navigator-container">{navigator}</div>);
  }

  if ((currentPage>=(maxButtonLR+3))&&(currentPage<=(totalPages-maxButtonLR-2))){
    //vista media
    navigator.push(<button key={2} onClick={() => {onSetNewPage(1)}} className='navigator-button'>{1}</button>);
    navigator.push(<div key={-3} className='navigator-text'>...</div>);
    for(let i=currentPage-maxButtonLR;i<=(currentPage+maxButtonLR);i++){
      navigator.push(<button key={i} onClick={() => {onSetNewPage(i)}} className={`navigator-button ${(i===currentPage ? 'selected-page' : null)}`}>{i}</button>);
    }
    navigator.push(<div key={-1} className='navigator-text'>...</div>);
    navigator.push(<button key={0} onClick={() => {onSetNewPage(totalPages)}} className='navigator-button'>{totalPages}</button>);
    return (<div className="navigator-container">{navigator}</div>);
  }

  //si se cae aqui es vista derecha si o si
  navigator.push(<button key={0} onClick={() => {onSetNewPage(1)}} className='navigator-button'>{1}</button>);
  navigator.push(<div key={-1} className='navigator-text'>...</div>);
  for(let i=totalPages-maxButton;i<=totalPages;i++){
    navigator.push(<button key={i} onClick={() => {onSetNewPage(i)}} className={`navigator-button ${(i===currentPage ? 'selected-page' : null)}`}>{i}</button>);
  }
  return (<div className="navigator-container">{navigator}</div>)

}
