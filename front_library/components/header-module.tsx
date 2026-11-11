export default function HeaderModule({title, description}: {title: string, description: string}) {
    return (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl shadow-sm mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-2">
                {title}
            </h2>
            <p className="text-muted-foreground text-sm">
                {description}
            </p>
        </div>
    );
}