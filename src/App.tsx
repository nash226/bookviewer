import React, { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import type { LayoutProps, BookAndChapterData, MenuProps, TableOfContentsProps, MenuLinkProps } from './types'
import "./App.css";



const getBookAndChapters = () => {
  const url = `/api/toc`
  const request = axios.get(url)
  return request.then(response => response.data) // book / chapters
}

const getChaptertext = (chapterName: string) => {
  const url = `/api/${chapterName}`
  const request = axios.get(url)
  return request.then(response => response.data) //chapter text
}

const Menu: React.FC<MenuProps> = ({ allChapters, handleChapterClick, handleTableOfContentClick }) => {
  return (
    <div id="menu">
          <div className="pure-menu">
              <a onClick={handleTableOfContentClick}className="pure-menu-heading" href="#" id='TableOfContents'>Table of Contents</a>
              <ul className="pure-menu-list">
                <li className="pure-menu-item">
                  {allChapters.map((chapter, i) => (
                    <a id={String(i)} onClick ={handleChapterClick} href="#" className="pure-menu-link" key={i} >Chapter {i + 1}: {chapter}</a>
                  ))}
                </li>
              </ul>
          </div>
    </div>
  )
}

const Header = () => {
  return (
    <div id='main'>
      <div className='header'>
        <h1>The Adventures of Sherlock Holmes</h1>
        <h2>by Sir Arthur Doyle</h2>
      </div>
    </div>
  )
}

const Layout: React.FC<LayoutProps> = ({ active, children }) => {
  return (
    <div id='layout' className={active ? "active" : ''}>
      {children}
    </div>
  )
}

const Main: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return (
    <div id='main'>
      {children}
    </div>
  )
}

const Content = ({currentChapter, chapterName}) => {
  return (
    <div className='content'>
      <h2 className='content-subhead'>{chapterName}</h2>

      <div className='pure-menu'></div>
        <ul className='pure-menu-list'>
          <li className='pure-menu-item'>
            <p className='content'>{currentChapter}</p>
          </li>
        </ul>
    </div>
  )
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  onSelectChapter
}) => {
  return (
    <div className="content">
      <h2 className="content-subhead">Table of Contents</h2>

      <div className="pure-menu">
        <ul className="pure-menu-list">
          {chapters.map((chapter, i) => (
            <li key={chapter} className="pure-menu-item">
              <a
                href="#"
                className="pure-menu-link"
                onClick={(e) => {
                  e.preventDefault()
                  onSelectChapter(chapter)
                }}
              >
                Chapter {i + 1}: {chapter}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const MenuLink: React.FC<MenuLinkProps> = ({ onToggle }) => {
  return (
    <a 
      href="#menu" 
      id="menuLink" 
      className="menu-link" 
      onClick={(e) => {
        e.preventDefault()
        onToggle()
      }}
    >
      <span></span>
    </a>
  )
}


function App() {
  const [book, setBook] = useState('')
  const [currentChapterText, setCurrentChapterText] = useState('')
  const [currentChapterTitle, setCurrentChapterTitle] = useState('')
  const [allChapters, setAllChapters] = useState<string[]>([])
  const [displayTableOfContent, setDisplayTableOfContent] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    getBookAndChapters().then((bookAndChapterData: BookAndChapterData) => {
      setBook(bookAndChapterData.book)
      setAllChapters(bookAndChapterData.chapters)
    })
  }, [])

  useEffect(() => {
  if (!currentChapterTitle) return

  getChaptertext(currentChapterTitle).then((chapterText) => {
    setCurrentChapterText(chapterText)
  })
  }, [currentChapterTitle])

  const handleChapterClick = (event) => {
    event.preventDefault()
    let id = Number(event.currentTarget.id)
    setDisplayTableOfContent(false)
    setCurrentChapterTitle(allChapters[id])
    setMenuOpen(false)
  }

  const handleTableOfContentClick = (event) => {
    event.preventDefault()
    setCurrentChapterTitle('')
    setCurrentChapterText('')
    setDisplayTableOfContent(true)
    setMenuOpen(false)
  }


  return (
    <>
    <Layout active={menuOpen}>
      <Main>
        <MenuLink onToggle={() => setMenuOpen((prev) => !prev)}/>
        <Header/>
        <Menu allChapters={allChapters} handleChapterClick={handleChapterClick} handleTableOfContentClick={handleTableOfContentClick}/>
        {displayTableOfContent ? (
          <TableOfContents
            chapters={allChapters}
            onSelectChapter={(chapter) => {
              setDisplayTableOfContent(false)
              setCurrentChapterTitle(chapter)
            }}
          />
        ) : (
          <Content
            currentChapter={currentChapterText}
            chapterName={currentChapterTitle}
          />
        )}      
        </Main>
     
    </Layout>
    
    </>
  )
}

export default App
