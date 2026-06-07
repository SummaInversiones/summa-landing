import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-num text-sm uppercase tracking-widest text-primary">
        Acceso anticipado
      </p>
      <h1 className="max-w-2xl text-4xl font-medium text-foreground sm:text-5xl">
        Palm Inversiones
      </h1>
      <p className="max-w-md text-muted-foreground">
        Fundación React lista. Las secciones se portan en la próxima etapa.
      </p>
      <Button>Bajate la app</Button>
    </main>
  );
}
