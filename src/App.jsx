import { useEffect, useRef, useState } from 'react'
import portrait from '../FOTO PARA QUEM SOU.jpeg'
import projectPrime from '../PORTFÓLIO/1.jpeg'
import projectKids from '../PORTFÓLIO/2.jpeg'
import projectGym from '../PORTFÓLIO/3.jpeg'
import projectResidence from '../PORTFÓLIO/4.jpeg'

const INTRO_KEY = 'lauro-arquiteto:intro-seen'
const INTRO_DURATION = 3600

function hasSeenIntro() { try { return window.sessionStorage.getItem(INTRO_KEY) === 'true' } catch { return true } }

function Intro({ onFinish }) {
  useEffect(() => { const timeout = window.setTimeout(onFinish, INTRO_DURATION); return () => window.clearTimeout(timeout) }, [onFinish])
  return <div className="intro" aria-hidden="true"><p className="intro__line intro__line--one">Espaços que inspiram.</p><p className="intro__line intro__line--two">Projetos com personalidade.</p><p className="intro__line intro__line--three">Arquitetura para viver.</p></div>
}

function usePortraitParallax(layerRef) {
  useEffect(() => {
    const layer = layerRef.current; const finePointer = window.matchMedia('(pointer: fine)'); const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)'); let frameId
    const reset = () => { layer?.style.setProperty('--portrait-x', '0px'); layer?.style.setProperty('--portrait-y', '0px') }
    const move = (event) => { if (!finePointer.matches || reducedMotion.matches) { reset(); return }; window.cancelAnimationFrame(frameId); frameId = window.requestAnimationFrame(() => { const x = (event.clientX / window.innerWidth - 0.5) * 10; const y = (event.clientY / window.innerHeight - 0.5) * 7; layer?.style.setProperty('--portrait-x', `${x.toFixed(2)}px`); layer?.style.setProperty('--portrait-y', `${y.toFixed(2)}px`) }) }
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('resize', reset)
    return () => { window.cancelAnimationFrame(frameId); window.removeEventListener('pointermove', move); window.removeEventListener('resize', reset) }
  }, [layerRef])
}

function Hero({ introComplete }) {
  const portraitLayer = useRef(null); usePortraitParallax(portraitLayer)
  return <main className={`hero ${introComplete ? 'hero--revealed' : ''}`} aria-labelledby="hero-title"><img className="hero__background" src={projectResidence} alt="Projeto residencial assinado por Lauro" /><div className="hero__veil" aria-hidden="true" /><div className="hero__content"><p className="hero__eyebrow">Lauro Arquitetura</p><h1 id="hero-title"><span>Espaços que</span><span>contam histórias.</span></h1><a className="hero__cta" href="#projetos"><span>Conhecer projetos</span></a></div><div className="hero__portrait" ref={portraitLayer}><img src={portrait} alt="Retrato de Lauro" /></div></main>
}

function moveCard(event) { const card = event.currentTarget; const bounds = card.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - 0.5; const y = (event.clientY - bounds.top) / bounds.height - 0.5; card.style.setProperty('--tilt-x', `${(-y * 5).toFixed(2)}deg`); card.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`); card.style.setProperty('--cursor-x', x.toFixed(3)); card.style.setProperty('--cursor-y', y.toFixed(3)) }
function resetCard(event) { event.currentTarget.style.setProperty('--tilt-x', '0deg'); event.currentTarget.style.setProperty('--tilt-y', '0deg'); event.currentTarget.style.setProperty('--cursor-x', '0'); event.currentTarget.style.setProperty('--cursor-y', '0') }

function About() { return <section className="about section" id="sobre" aria-labelledby="about-title"><div className="about__grid"><div className="about__copy" onMouseMove={moveCard} onMouseLeave={resetCard}><h2 id="about-title">Projetos que equilibram estética, técnica e a forma única de viver cada espaço.</h2><div className="about__text"><p>Lauro Arquitetura cria projetos autorais que traduzem a personalidade de cada cliente em espaços acolhedores, funcionais e cheios de identidade.</p><p>Cada trabalho nasce da escuta, do cuidado com os detalhes e de soluções pensadas para acompanhar a vida real.</p></div></div><div className="about__portrait" onMouseMove={moveCard} onMouseLeave={resetCard}><p className="about__portrait-label">Arquitetura e interiores</p><img src={portrait} alt="Lauro em um espaço histórico" /></div></div></section> }

function Expertise() {
  const areas = [['01', 'Residencial', 'Casas e apartamentos pensados para acolher histórias, rotinas e novos momentos.'], ['02', 'Comercial', 'Espaços que comunicam marcas, fortalecem experiências e criam presença.'], ['03', 'Interiores', 'Composição precisa de layout, materiais, iluminação e personalidade.']]
  const tiltCard = (event) => { const card = event.currentTarget; const bounds = card.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width - 0.5; const y = (event.clientY - bounds.top) / bounds.height - 0.5; card.style.setProperty('--tilt-x', `${(-y * 7).toFixed(2)}deg`); card.style.setProperty('--tilt-y', `${(x * 7).toFixed(2)}deg`); card.style.setProperty('--glow-x', `${((x + 0.5) * 100).toFixed(1)}%`); card.style.setProperty('--glow-y', `${((y + 0.5) * 100).toFixed(1)}%`) }
  return <section className="expertise section" id="atuacao" aria-labelledby="expertise-title"><div className="expertise__heading"><h2 id="expertise-title"><span>Projetos com</span><span>intenção.</span></h2><p>que tipo de projeto você deseja?</p></div><div className="expertise__list">{areas.map(([number, title, text]) => <a className="expertise__item" key={title} href="#projetos" onMouseMove={tiltCard} onMouseLeave={resetCard}><span>{number}</span><h3>{title}</h3><p>{text}</p></a>)}</div></section>
}

function Projects() {
  const [activeProject, setActiveProject] = useState(null); const projects = [{ image: projectPrime, title: 'Prime Fitness', type: 'Comercial' }, { image: projectKids, title: 'Quarto infantil', type: 'Interiores' }, { image: projectGym, title: 'Academia Prime', type: 'Comercial' }, { image: projectResidence, title: 'Casa com pátio', type: 'Residencial' }]
  useEffect(() => { if (activeProject === null) return undefined; const closeOnEscape = (event) => { if (event.key === 'Escape') setActiveProject(null) }; window.addEventListener('keydown', closeOnEscape); return () => window.removeEventListener('keydown', closeOnEscape) }, [activeProject])
  return <section className="projects section" id="projetos" aria-labelledby="projects-title"><div className="projects__heading"><h2 id="projects-title">Portfólio</h2><p>Uma seleção de projetos assinados por Lauro Arquitetura.</p></div><div className="projects__gallery">{projects.map((project, index) => <button className={`projects__item projects__item--${index + 1}`} key={project.title} type="button" onClick={() => setActiveProject(index)}><img src={project.image} alt={`${project.title}, projeto ${project.type.toLowerCase()} de Lauro Arquitetura`} /><span className="projects__caption"><strong>{project.title}</strong><em>{project.type}</em></span></button>)}</div><p className="projects__hint">Clique para expandir</p>{activeProject !== null && <div className="projects__lightbox" role="dialog" aria-modal="true" aria-label={`Imagem ampliada: ${projects[activeProject].title}`} onClick={() => setActiveProject(null)}><button className="projects__close" type="button" onClick={() => setActiveProject(null)} aria-label="Fechar imagem">Fechar <span aria-hidden="true">x</span></button><img src={projects[activeProject].image} alt={projects[activeProject].title} /></div>}</section>
}

function Contact() { return <section className="contact section" id="contato" aria-labelledby="contact-title"><div className="contact__background" aria-hidden="true"><img src={portrait} alt="" /></div><div className="contact__heading"><h2 id="contact-title"><span>Vamos criar</span><span>algo especial?</span></h2></div><div className="contact__details"><p>Arquitetura e interiores para espaços com identidade, propósito e cuidado em cada escolha.</p><a className="contact__schedule" href="https://wa.me/559984190204" target="_blank" rel="noreferrer" aria-label="Falar com Lauro pelo WhatsApp"><span>Ver portfólio</span></a></div></section> }

export default function App() { const [introVisible, setIntroVisible] = useState(() => !hasSeenIntro()); const finishIntro = () => { try { window.sessionStorage.setItem(INTRO_KEY, 'true') } catch { /* ignore */ } setIntroVisible(false) }; return <><Hero introComplete={!introVisible} /><Projects /><About /><Expertise /><Contact />{introVisible && <Intro onFinish={finishIntro} />}</> }
