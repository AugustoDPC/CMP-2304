import { Route, Routes } from "react-router-dom"
import { HomePages } from "../pages/HomePages"
import { SobrePages } from "../pages/SobrePages"
import { UsuarioPages } from "../pages/UsuarioPages"


export const AppRouter = () => {
  return (
    <>
        <Routes>
            <Route path="/" element={<HomePages />} />
            <Route path="/sobre" element={<SobrePages />} />
            <Route path="/usuario" element={<UsuarioPages />} />
        </Routes>
    </>
    )
}
