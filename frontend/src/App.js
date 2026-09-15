import React from "react";
import "@/App.css";
import "leaflet/dist/leaflet.css";
import { Toaster } from "sonner";
import { AppProvider, useApp } from "@/context/AppContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { VehicleSelect } from "@/components/VehicleSelect";
import { CategoryGrid } from "@/components/CategoryGrid";
import { BusinessList } from "@/components/BusinessList";
import { BusinessDetail } from "@/components/BusinessDetail";
import { SearchResults } from "@/components/SearchResults";
import { AgendaFierro } from "@/components/AgendaFierro";
import { Mach5Bar } from "@/components/Mach5Bar";
import { ModalHost } from "@/components/modals/Modal";

function Screen() {
  const { current } = useApp();
  switch (current.screen) {
    case "categories":
      return <CategoryGrid vehicle={current.vehicle} />;
    case "list":
      return <BusinessList vehicle={current.vehicle} category={current.category} />;
    case "detail":
      return <BusinessDetail id={current.id} />;
    case "search":
      return <SearchResults query={current.query} />;
    case "home":
    default:
      return (
        <>
          <Hero />
          <VehicleSelect />
          <AgendaFierro />
        </>
      );
  }
}

function Shell() {
  return (
    <div className="App min-h-screen bg-[#0B0C10] text-white flex flex-col">
      <Header />
      <main className="flex-1 pb-40">
        <Screen />
      </main>
      <Footer />
      <Mach5Bar />
      <ModalHost />
      <Toaster theme="dark" position="top-center" richColors />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
