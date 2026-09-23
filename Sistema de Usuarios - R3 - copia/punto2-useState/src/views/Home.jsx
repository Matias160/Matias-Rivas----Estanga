export function Home({ setScreen }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">useState + API SQL</p>
        <h1>Sistema de usuarios con navegacion por estado</h1>
        <p>
          Este punto no usa enrutador: cada vista se muestra desde un estado de React, manteniendo
          sesion protegida, validaciones y persistencia.
        </p>
        <div className="actions">
          <button className="primary" onClick={() => setScreen('registro')}>
            Crear cuenta
          </button>
          <button className="secondary" onClick={() => setScreen('login')}>
            Ingresar
          </button>
        </div>
      </div>
    </section>
  );
}
