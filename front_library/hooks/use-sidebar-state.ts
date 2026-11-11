import * as React from "react";

const BREAKPOINTS = {
  md: 768,
  xl: 1280,
};

// Define los estados posibles para el sidebar
type SidebarView = "hidden" | "compact" | "expanded";

export function useSidebarState() {
  // Estado que refleja la vista por defecto basada en el ancho de la ventana
  const [defaultView, setDefaultView] = React.useState<SidebarView>("hidden");
  // Estado que almacena la acción del usuario (toggle)
  // undefined significa que aún no ha habido interacción y seguimos la defaultView
  // true significa que el usuario ha forzado el estado contrario al default
  const [userToggled, setUserToggled] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      let newDefaultView: SidebarView;

      if (currentWidth < BREAKPOINTS.md) {
        newDefaultView = "hidden";
      } else if (currentWidth < BREAKPOINTS.xl) {
        newDefaultView = "compact";
      } else {
        newDefaultView = "expanded";
      }
      setDefaultView(newDefaultView);
    };

    handleResize(); // Establecer el estado inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para alternar el estado del sidebar
  const toggleSidebar = React.useCallback(() => {
    setUserToggled((prev) => !prev);
  }, []);

  // Lógica para determinar el estado final del sidebar
  let isSidebarVisible: boolean;
  let isSidebarCompact: boolean;

  if (defaultView === "hidden") {
    // Para pantallas pequeñas, está oculto por defecto
    // Se muestra si userToggled es true
    isSidebarVisible = userToggled === true;
    isSidebarCompact = true; // Cuando se muestra en móvil, siempre es compacto (Sheet)
  } else if (defaultView === "compact") {
    // Para md, está compactado por defecto
    // Se expande si userToggled es true
    isSidebarVisible = true;
    isSidebarCompact = userToggled === undefined ? true : !userToggled;
  } else { // defaultView === "expanded"
    // Para xl, está expandido por defecto
    // Se compacta si userToggled es true
    isSidebarVisible = true;
    isSidebarCompact = userToggled === undefined ? false : userToggled;
  }

  const isMobile = window.innerWidth < BREAKPOINTS.md;

  return {
    isSidebarVisible,
    isSidebarCompact,
    isMobile,
    toggleSidebar,
  };
}