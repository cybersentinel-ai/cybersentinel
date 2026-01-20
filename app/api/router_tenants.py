from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.database import get_db
from app.models.tenant import Tenant as TenantModel
from app.schemas.tenant import Tenant, TenantCreate

router = APIRouter(prefix="/tenants", tags=["tenants"])

@router.post("/", response_model=Tenant)
async def create_tenant(tenant_in: TenantCreate, db: AsyncSession = Depends(get_db)):
    db_tenant = TenantModel(name=tenant_in.name)
    db.add(db_tenant)
    await db.commit()
    await db.refresh(db_tenant)
    return db_tenant

@router.get("/{tenant_id}", response_model=Tenant)
async def get_tenant(tenant_id: UUID, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(TenantModel).where(TenantModel.id == tenant_id))
    db_tenant = result.scalars().first()
    if not db_tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return db_tenant
