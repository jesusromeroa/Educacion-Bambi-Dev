import React from 'react'
import './styles/contentsTable.css'
import CategoryIcon from '@mui/icons-material/Category'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';

const resourceIcons = {
  default: <CategoryIcon sx={{ color: 'var(--darkGray)' }}/>,
  pdf: <PictureAsPdfIcon sx={{ color: 'var(--red)' }}/>,
  doc: <DescriptionIcon sx={{ color: 'var(--bambiBlue)' }}/>,
  video: <MovieIcon sx={{ color: 'var(--orange)' }}/>,
  imagen: <ImageIcon sx={{ color: 'var(--purple)' }}/>,
  
}

export const ContentsTable = ({pageItems = [], format= {tableFormat: [], dataFormat: []}}) => {

  return (
    <>
      <div style={{borderRadius: '15px', overflow: 'hidden'}}>
        <div className='table-container'>
        <table className='contents-table'>
          <thead>
            <tr>
              {format.tableFormat.map((columnName, index) => (<th key={index}>{columnName}</th>))}
            </tr> 
          </thead>
          <tbody>
            {pageItems.map((row, index) => {
              return (<tr key={ index }>
                        {format.dataFormat.map((propertyName, index) => (
                          <td key={index}>
                            { 
                              (index === 0) ? //if this is the first column, it has the image + link
                              (     
                                  <div className='link-column' style={{display: 'flex', justifyContent:'left', alignItems: 'center'}}>
                                    {
                                      (resourceIcons[ row['format'].toLowerCase() ]) ?
                                      (resourceIcons[ row['format'].toLowerCase() ])
                                      :
                                      (resourceIcons[ 'default' ])
                                    }
                                    {
                                      <a href={row.url} target="_blank" rel="noopener noreferrer" style={{marginLeft: '20px'}}>
                                        { (row[propertyName]) ? row[propertyName] : 'N/A' }
                                      </a>
                                    }
                                  </div>
                              )
                              : //if not, it just prints the text
                              (
                                  (row[propertyName]) ? row[propertyName] : 'N/A'
                              )
                            }
                          </td>))}
                      </tr>)
            })}
          </tbody>
        </table>
      </div>
      {
          (pageItems.length === 0) ?
          (
            <div className='no-items-found-container'>
              <FindInPageRoundedIcon sx={{ fontSize: 120 }}/>
              <p>No se encontró ningún recurso...</p>
            </div>
          )
          :
          (
            null
          )
        }
      </div>
      
    </>
    
  )
}
